# backend/app/api/chat.py
"""
NutriLens AI — Versatile General-Purpose & Nutrition AI Assistant Endpoint
Combines high-performance Gemini AI models, conversation context memory,
selective repository RAG retrieval, application tools, and robust failover.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
import os
import re
import time

# pyrefly: ignore [missing-import]
from ..dependencies import get_current_user
# pyrefly: ignore [missing-import]
from ..database import get_db
# pyrefly: ignore [missing-import]
from .. import models
# pyrefly: ignore [missing-import]
from ..config import GEMINI_API_KEY
# pyrefly: ignore [missing-import]
from ..training_data import TRAINING_DATA
# pyrefly: ignore [missing-import]
from ..services.project_rag import search_project_knowledge
# pyrefly: ignore [missing-import]
from ..services.ai_tools import execute_tool

router = APIRouter()

# ── Schemas ───────────────────────────────────────────────────────────────────
class ChatMessageItem(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    message: str = Field(..., description="User prompt or follow-up question")
    history: List[Dict[str, Any]] = Field(default=[], description="Previous conversation turns")

class SourceReference(BaseModel):
    title: str
    file_path: str

class ChatResponse(BaseModel):
    reply: str
    source: str = "gemini"  # "gemini" | "project_rag" | "tools" | "training" | "fallback"
    tools_used: List[str] = []
    sources: List[SourceReference] = []

# ── Gemini Client Singleton ──────────────────────────────────────────────────
_gemini_client = None

def get_gemini_client():
    global _gemini_client
    if _gemini_client is not None:
        return _gemini_client
    key = GEMINI_API_KEY or os.getenv("AI_API_KEY")
    if not key or key == "YOUR_GEMINI_API_KEY_HERE":
        return None
    try:
        from google import genai
        _gemini_client = genai.Client(api_key=key)
        return _gemini_client
    except Exception as e:
        print(f"[Gemini Client Init Warning]: {e}")
        return None

# Validated, high-availability Gemini models ordered by response speed & reliability
GEMINI_MODELS = [
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite-preview",
    "gemini-3-flash-preview",
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
]

# ── Comprehensive General-Purpose & Domain System Instruction ─────────────────
SYSTEM_PROMPT = """You are NutriLens AI — a highly capable, versatile, general-purpose AI assistant and intelligent nutrition companion.

Your Core Capabilities & Persona:
1. General-Purpose Problem Solving & Explanations:
   - You answer ANY question across all domains: computer science, programming, software engineering, mathematics, physics, engineering subjects, exam preparation, writing, literature, logic, business, history, and general knowledge.
   - For coding requests: write clean, modern, syntactically correct, and complete code (Python, JavaScript/TypeScript, React, FastAPI, Java, C++, SQL, Go, Rust, HTML/CSS, etc.) with helpful explanations and Markdown code blocks.
   - For debugging requests: analyze error messages, explain root causes clearly, and provide working fixed code with line-by-line rationale.
   - For mathematics and academic problems: provide step-by-step solutions, display relevant formulas, and show intermediate calculations.
   - For conceptual explanations: break down complex ideas into intuitive steps and use real-life analogies when helpful.

2. NutriLens AI & Nutrition Domain:
   - When users ask about food, calories, macronutrients, health goals, diet planning, wellness, or grocery products, provide authoritative, evidence-based guidance.
   - When verified user profile metrics, logged meals, or food database items are provided in context, incorporate those exact numbers seamlessly.
   - When asked about the NutriLens AI application, architecture, or components, reference actual repository conventions and files.

3. Conversational Guidelines & Style:
   - Directly address what the user actually asked. Do not deflect non-nutrition questions or force discussions back to diet.
   - Understand and seamlessly continue follow-up questions referencing previous turns ("explain simpler", "give me the code", "fix that error", "compare both").
   - Format responses using clean Markdown: clear headings, bullet points, bold highlights, and fenced code blocks with language identifiers.
   - Be concise when a short answer suffices; provide deep, structured explanations when the user asks for comprehensive detail.
   - Never invent facts or hallucinate citations. If information is unavailable or uncertain, state it honestly.
   - Respond in the language or tone requested by the user (English, Hindi, etc.)."""


def _prepare_gemini_history(history: List[Dict[str, Any]]) -> List[Any]:
    """
    Validates, sanitizes, and bounds conversation history for Gemini multi-turn chat.
    Ensures:
    - Bounded to the last 10 turns.
    - Consecutive messages of the same role are combined to enforce strict alternation.
    - The conversation history always begins with a user turn.
    """
    from google.genai import types

    cleaned: List[Any] = []
    recent_turns = history[-10:] if len(history) > 10 else history

    for item in recent_turns:
        raw_role = str(item.get("role", "")).lower().strip()
        text = str(item.get("text", "")).strip()
        if not text:
            continue
        gemini_role = "user" if raw_role in ["user", "human"] else "model"

        if cleaned and cleaned[-1].role == gemini_role:
            existing_part = cleaned[-1].parts[0].text if cleaned[-1].parts else ""
            cleaned[-1] = types.Content(
                role=gemini_role,
                parts=[types.Part(text=f"{existing_part}\n\n{text}")]
            )
        else:
            cleaned.append(types.Content(role=gemini_role, parts=[types.Part(text=text)]))

    # Gemini multi-turn history MUST begin with user turn
    while cleaned and cleaned[0].role != "user":
        cleaned.pop(0)

    return cleaned


def _detect_tools_and_context(query: str, user: models.User, db: Session):
    """
    Selectively executes backend tools only when strictly relevant to the user's intent.
    Normal general questions (programming, mathematics, general knowledge) bypass project tools
    to prevent irrelevant context contamination.
    """
    tools_used: List[str] = []
    sources: List[SourceReference] = []
    context_sections: List[str] = []

    q = query.lower()

    # 1. Project Codebase queries specifically for NutriLens AI
    nutrilens_explicit = (
        "nutrilens" in q or "nutri-ai" in q or "nutri ai" in q
        or "in this app" in q or "in this project" in q or "in our project" in q
        or "in this codebase" in q or "in this repo" in q or "in our codebase" in q
        or "our backend" in q or "our frontend" in q or "how does our" in q
        or "how does this app" in q or "how is this app" in q
        or any(k in q for k in [
            "barcodescan.tsx", "visioncamera", "dietplan.tsx", "models.py",
            "chat.tsx", "ai_tools.py", "project_rag.py", "database.py"
        ])
    )

    if nutrilens_explicit:
        rag_hits = search_project_knowledge(query, top_k=3)
        if rag_hits:
            tools_used.append("search_project_knowledge")
            snippets = []
            for hit in rag_hits:
                sources.append(SourceReference(title=hit["title"], file_path=hit["file_path"]))
                snippet_text = f"### [{hit['file_path']}] {hit['title']}\n{hit['content']}"
                if hit.get("code_snippet"):
                    snippet_text += f"\nCode excerpt:\n```\n{hit['code_snippet']}\n```"
                snippets.append(snippet_text)
            context_sections.append("PROJECT CODEBASE CONTEXT:\n" + "\n\n".join(snippets))

    # 2. User Profile / BMR / Calorie Targets
    profile_triggers = [
        "my profile", "my calories", "my daily target", "my goal", "my bmr",
        "my calorie target", "my macros", "how much protein do i need",
        "what is my calorie limit", "my calorie goal"
    ]
    if any(trig in q for trig in profile_triggers):
        prof_data = execute_tool("get_user_profile", {}, user, db)
        tools_used.append("get_user_profile")
        context_sections.append(f"AUTHENTICATED USER PROFILE:\n{prof_data}")

    # 3. Logged Meals queries
    meal_triggers = [
        "my meal", "logged today", "what did i eat", "today's meal",
        "my meal history", "analyze my meals", "dinner today", "lunch today", "breakfast today"
    ]
    if any(trig in q for trig in meal_triggers):
        meals_data = execute_tool("get_meal_history", {"limit": 5}, user, db)
        tools_used.append("get_meal_history")
        context_sections.append(f"USER RECENT MEAL LOGS (DATABASE):\n{meals_data}")

    # 4. Barcode lookup queries
    barcode_match = re.search(r"\b\d{8,14}\b", query)
    if barcode_match or ("barcode" in q and any(c.isdigit() for c in q)):
        code = barcode_match.group(0) if barcode_match else "".join(filter(str.isdigit, query))
        if code and len(code) >= 6:
            barcode_data = execute_tool("lookup_barcode", {"barcode": code}, user, db)
            tools_used.append("lookup_barcode")
            context_sections.append(f"BARCODE PRODUCT LOOKUP RESULT:\n{barcode_data}")

    # 5. Food item database lookup
    food_search_triggers = ["calories in", "nutrition in", "protein in 100g", "search food in db"]
    if any(trig in q for trig in food_search_triggers):
        cleaned_food = re.sub(
            r"(calories in|nutrition in|protein in 100g|search food in db|100g of|100g|per 100g|\?)",
            "",
            q,
            flags=re.IGNORECASE
        ).strip()
        if cleaned_food and len(cleaned_food) >= 2:
            food_db_res = execute_tool("search_foods", {"query": cleaned_food, "limit": 3}, user, db)
            if food_db_res.get("status") == "success":
                tools_used.append("search_foods")
                context_sections.append(f"VERIFIED DATABASE FOOD MATCHES:\n{food_db_res}")

    return tools_used, sources, "\n\n".join(context_sections)


def _call_gemini_with_fallback(
    message: str,
    history: List[Dict[str, Any]],
    augmented_context: str
) -> Optional[str]:
    """Calls Gemini with automated multi-model failover, bounded history, and Millisecond timeout."""
    client = get_gemini_client()
    if client is None:
        return None

    from google.genai import types

    chat_history = _prepare_gemini_history(history)

    full_instruction = SYSTEM_PROMPT
    if augmented_context:
        full_instruction += f"\n\nCURRENT VERIFIED APPLICATION CONTEXT:\n{augmented_context}"

    config = types.GenerateContentConfig(
        system_instruction=full_instruction,
        temperature=0.5,
        http_options=types.HttpOptions(timeout=20000),  # 20,000 milliseconds = 20s
    )

    for model_name in GEMINI_MODELS:
        try:
            chat = client.chats.create(
                model=model_name,
                config=config,
                history=chat_history,
            )
            response = chat.send_message(message)
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            err_str = str(e)
            print(f"[Gemini Fallback] Model '{model_name}' failed: {err_str[:120]}")
            continue

    return None


def _intelligent_offline_response(query: str, augmented_context: str, sources: List[SourceReference]) -> str:
    """
    Transparent, high-utility offline fallback when external AI APIs are down.
    Never hallucinates unrelated food answers for coding or general queries.
    """
    # 1. Project codebase query with verified source
    if sources and "PROJECT CODEBASE CONTEXT:" in augmented_context:
        top_src = sources[0]
        return (
            f"Here is the verified information from **`{top_src.file_path}`**:\n\n"
            f"📁 **Source**: [{top_src.title}]({top_src.file_path})\n\n"
            + augmented_context.replace("PROJECT CODEBASE CONTEXT:\n", "")[:800]
            + "\n\n💡 *Retrieved directly from NutriLens AI repository knowledge base.*"
        )

    # 2. Database Profile context
    if "AUTHENTICATED USER PROFILE:" in augmented_context:
        return (
            "Here is your active profile data from the NutriLens database:\n\n"
            + augmented_context.replace("AUTHENTICATED USER PROFILE:\n", "")
        )

    # 3. Database Meal logs
    if "USER RECENT MEAL LOGS (DATABASE):" in augmented_context:
        return (
            "Here are your recent meal logs from the database:\n\n"
            + augmented_context.replace("USER RECENT MEAL LOGS (DATABASE):\n", "")
        )

    # 4. Standard Greetings or FAQ
    norm = query.lower().strip()
    norm_clean = re.sub(r"[^\w\s]", " ", norm)
    norm_clean = re.sub(r"\s+", " ", norm_clean).strip()

    for triggers, resp in TRAINING_DATA:
        for trig in triggers:
            pattern = r"\b" + re.escape(trig) + r"\b"
            if re.search(pattern, norm_clean):
                return resp

    # 5. General queries when external provider is unreachable
    return (
        "⚠️ **AI Service Notice**: The AI provider is temporarily unavailable or experiencing high traffic. "
        "Your message has been preserved. Please try asking again in a few moments.\n\n"
        "💡 *If asking about NutriLens, you can also explore your Dashboard, Diet Plan, Meal History, or Barcode Scanner.*"
    )

# Backward-compatibility alias for tests
_offline_fallback_response = _intelligent_offline_response


@router.post("/", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    start_time = time.time()
    user_message = request.message.strip()
    if not user_message:
        return ChatResponse(
            reply="Hello! How can I assist you today? You can ask me general questions, programming problems, calculations, or anything about NutriLens nutrition and features.",
            source="fallback"
        )

    # 1. Intent Analysis & Selective Tool Execution
    tools_used, sources, augmented_context = _detect_tools_and_context(user_message, user, db)

    # 2. Multi-Model Gemini Generation
    gemini_reply = _call_gemini_with_fallback(user_message, request.history, augmented_context)
    if gemini_reply:
        elapsed = round((time.time() - start_time) * 1000, 2)
        print(f"[Chat] Gemini answered in {elapsed}ms | Tools: {tools_used}")
        return ChatResponse(
            reply=gemini_reply,
            source="gemini",
            tools_used=tools_used,
            sources=sources
        )

    # 3. Intelligent Fallback
    fallback_reply = _intelligent_offline_response(user_message, augmented_context, sources)
    source_type = "project_rag" if sources else ("tools" if tools_used else "fallback")

    return ChatResponse(
        reply=fallback_reply,
        source=source_type,
        tools_used=tools_used,
        sources=sources
    )
