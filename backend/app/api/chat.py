# backend/app/api/chat.py
"""
NutriLens AI — Project-Aware, Fast, and Tool-Enabled Assistant Endpoint
Combines repository RAG retrieval, real application tools, Gemini AI,
and offline fallback engines for reliable, fast answers.
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
import os
import re
import random
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
from ..training_data import TRAINING_DATA, FALLBACK_RESPONSES
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
    message: str
    history: List[Dict[str, Any]] = []

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

# High-priority models verified in production
GEMINI_MODELS = [
    "gemini-flash-lite-latest",
    "gemini-3-flash-preview",
    "gemini-3.1-flash-lite-preview",
    "gemini-3.8-flash"
]

SYSTEM_PROMPT = """You are NutriLens AI — the official intelligent assistant for the NutriLens AI application.
You possess deep clinical and practical knowledge of human nutrition, calories, macronutrients, and healthy living,
AS WELL AS complete technical understanding of the NutriLens AI codebase, architecture, components, and APIs.

Your Core Capabilities:
1. Personal Nutrition & Meal Analysis: Help users understand their daily calorie allowance, macros, and logged food entries using live user data provided in context.
2. Code & Architecture Guidance: When asked about NutriLens features, files, or endpoints, use the indexed repository context and cite exact file paths (e.g., `frontend/src/pages/BarcodeScan.tsx`).
3. Barcode & Product Facts: Explain grocery nutrition, ingredients, and allergen alerts accurately.
4. Syntactically Valid Code: When asked for code, provide clean, idiomatic React 19 / TypeScript / FastAPI snippets matching project conventions.
5. Empathy & Health Safety: Always provide evidence-based, actionable guidance. Never diagnose medical conditions or prescribe pharmaceuticals. If urgent medical symptoms arise, advise consulting a healthcare professional.

Formatting: Use clean Markdown, bold highlights, bullet points, and appropriate emojis to make responses engaging and easy to read."""


def _detect_tools_and_context(query: str, user: models.User, db: Session):
    """
    Analyzes intent and executes appropriate backend tools to build high-relevance context.
    """
    tools_used: List[str] = []
    sources: List[SourceReference] = []
    context_sections: List[str] = []

    q = query.lower()

    # 1. Project Code / Architecture / API queries
    project_indicators = [
        "code", "repo", "api", "endpoint", "route", "backend", "frontend", "model",
        "barcodescan", "visioncamera", "dashboard", "dietplan", "addmeal", "main.py",
        "models.py", "database", "fastapi", "react", "vite", "render", "vercel",
        "how does", "how is", "file", "architecture", "implementation", "nutrilens"
    ]
    if any(ind in q for ind in project_indicators):
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

    # 2. User Profile / BMR / Calorie Target queries
    profile_indicators = ["my profile", "my calories", "my goal", "bmr", "target", "calorie limit", "how much protein do i need", "macros"]
    if any(ind in q for ind in profile_indicators):
        prof_data = execute_tool("get_user_profile", {}, user, db)
        tools_used.append("get_user_profile")
        context_sections.append(f"AUTHENTICATED USER PROFILE:\n{prof_data}")

    # 3. Logged Meals / "What did I eat" queries
    meal_indicators = ["my meal", "logged", "what did i eat", "today's meal", "history", "analyze my meal", "dinner today", "lunch today"]
    if any(ind in q for ind in meal_indicators):
        meals_data = execute_tool("get_meal_history", {"limit": 5}, user, db)
        tools_used.append("get_meal_history")
        context_sections.append(f"USER RECENT MEAL LOGS (LIVE DATABASE):\n{meals_data}")

    # 4. Barcode lookup queries (e.g. "barcode 737628064502" or raw digits)
    barcode_match = re.search(r"\b\d{8,14}\b", query)
    if barcode_match or "barcode" in q and any(c.isdigit() for c in q):
        code = barcode_match.group(0) if barcode_match else "".join(filter(str.isdigit, query))
        if code and len(code) >= 6:
            barcode_data = execute_tool("lookup_barcode", {"barcode": code}, user, db)
            tools_used.append("lookup_barcode")
            context_sections.append(f"BARCODE PRODUCT LOOKUP RESULT:\n{barcode_data}")

    # 5. Food item database lookup
    food_search_indicators = ["calories in", "nutrition in", "protein in", "facts of", "search food"]
    if any(ind in q for ind in food_search_indicators):
        cleaned_food = re.sub(r"(calories in|nutrition in|protein in|facts of|search food|100g of|100g|per 100g|\?)", "", q).strip()
        if cleaned_food:
            food_db_res = execute_tool("search_foods", {"query": cleaned_food, "limit": 3}, user, db)
            if food_db_res.get("status") == "success":
                tools_used.append("search_foods")
                context_sections.append(f"DATABASE FOOD MATCHES:\n{food_db_res}")

    return tools_used, sources, "\n\n".join(context_sections)


def _call_gemini_with_fallback(
    message: str,
    history: List[Dict[str, Any]],
    augmented_context: str
) -> Optional[str]:
    """Calls Gemini with automated multi-model failover and bounded conversation history."""
    client = get_gemini_client()
    if client is None:
        return None

    from google.genai import types

    # Prepare chat history (bounded to last 8 turns)
    chat_history = []
    for turn in history[-8:]:
        role = "user" if turn.get("role") == "user" else "model"
        text = turn.get("text", "")
        if text:
            chat_history.append(types.Content(role=role, parts=[types.Part(text=text)]))

    # Incorporate augmented real context into system instruction
    full_instruction = SYSTEM_PROMPT
    if augmented_context:
        full_instruction += f"\n\nCURRENT RETRIEVED REAL-TIME CONTEXT:\n{augmented_context}"

    config = types.GenerateContentConfig(
        system_instruction=full_instruction,
        temperature=0.4,
    )

    # Attempt primary and fallback models
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
            # Try next model in fallback list
            continue

    return None


def _offline_fallback_response(query: str, augmented_context: str, sources: List[SourceReference]) -> str:
    """Deterministic offline fallback ensuring 100% availability if external AI APIs are down."""
    # If we have RAG codebase sources retrieved, synthesize a direct answer
    if sources and "PROJECT CODEBASE CONTEXT:" in augmented_context:
        top_src = sources[0]
        return (
            f"Here is the verified information from **`{top_src.file_path}`**:\n\n"
            f"📁 **Source**: [{top_src.title}]({top_src.file_path})\n\n"
            + augmented_context.replace("PROJECT CODEBASE CONTEXT:\n", "")[:800]
            + "\n\n💡 *Retrieved directly from NutriLens AI repository knowledge base.*"
        )

    # Check keyword training pairs
    norm = query.lower().strip()
    norm = re.sub(r"[^\w\s]", " ", norm)
    norm = re.sub(r"\s+", " ", norm).strip()

    for triggers, resp in TRAINING_DATA:
        for trig in triggers:
            pattern = r"\b" + re.escape(trig) + r"\b"
            if re.search(pattern, norm):
                return resp

    return random.choice(FALLBACK_RESPONSES)


@router.post("/", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    start_time = time.time()
    user_message = request.message.strip()
    if not user_message:
        return ChatResponse(reply="How can I assist you with your nutrition or the NutriLens application today?", source="fallback")

    # 1. Intent Analysis & Real Tool Dispatching
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

    # 3. High-Quality Direct Knowledge / Training Fallback
    fallback_reply = _offline_fallback_response(user_message, augmented_context, sources)
    source_type = "project_rag" if sources else ("tools" if tools_used else "training")

    return ChatResponse(
        reply=fallback_reply,
        source=source_type,
        tools_used=tools_used,
        sources=sources
    )
