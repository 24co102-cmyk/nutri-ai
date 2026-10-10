from fastapi import APIRouter, Depends
from pydantic import BaseModel
import random
import re

# pyrefly: ignore [missing-import]
from ..dependencies import get_current_user
# pyrefly: ignore [missing-import]
from .. import models
# pyrefly: ignore [missing-import]
from ..training_data import TRAINING_DATA, FALLBACK_RESPONSES
# pyrefly: ignore [missing-import]
from ..config import GEMINI_API_KEY

router = APIRouter()

# -- Gemini client (lazy-init, new google.genai SDK) --------------------------
_gemini_client = None

SYSTEM_INSTRUCTION = (
    "You are NutriAI, an expert nutrition and diet assistant inside the Nutri AI app. "
    "You give accurate, friendly, and conversational answers about nutrition, calories, "
    "macros, meal planning, diets, food science, health goals, and wellness. "
    "Keep responses concise but helpful - use bullet points and emojis where appropriate. "
    "If a question is not related to nutrition, food, health, or fitness, politely redirect "
    "the user back to nutrition topics."
)

def _get_gemini_client():
    global _gemini_client
    if _gemini_client is not None:
        return _gemini_client
    if not GEMINI_API_KEY or GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
        return None
    try:
        from google import genai
        _gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        return _gemini_client
    except Exception as e:
        print(f"[Gemini] Failed to create client: {e}")
        return None


# -- Schemas -------------------------------------------------------------------
class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []   # optional conversation history [{role, text}]


class ChatResponse(BaseModel):
    reply: str
    source: str = "training"   # "gemini" | "training" | "fallback"


# -- Training-data fallback (always available offline) ------------------------
def _normalize(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _find_training_reply(user_message: str) -> str | None:
    normalized = _normalize(user_message)
    if not normalized:
        return None

    # 1. Exact match first (highest priority)
    for triggers, response in TRAINING_DATA:
        if normalized in triggers:
            return response

    # 2. Sub-phrase match using word boundaries (e.g. 'hi' only matches the word 'hi', not 'this' or 'chicken thigh')
    for triggers, response in TRAINING_DATA:
        for phrase in triggers:
            # Create a word boundary regex pattern
            pattern = r'\b' + re.escape(phrase) + r'\b'
            if re.search(pattern, normalized):
                return response

    return None


# -- Gemini reply --------------------------------------------------------------
def _ask_gemini(message: str, history: list[dict]) -> str | None:
    client = _get_gemini_client()
    if client is None:
        return None

    import time
    from google.genai import types

    # Build multi-turn history for context
    chat_history = []
    for turn in history[-10:]:
        role = "user" if turn.get("role") == "user" else "model"
        chat_history.append(
            types.Content(role=role, parts=[types.Part(text=turn.get("text", ""))])
        )

    config = types.GenerateContentConfig(
        system_instruction=SYSTEM_INSTRUCTION,
    )

    # Retry up to 3 times on transient errors (503 overload, timeouts)
    for attempt in range(3):
        try:
            chat = client.chats.create(
                model="gemini-3.8-flash",
                config=config,
                history=chat_history,
            )
            response = chat.send_message(message)
            text = response.text.strip() if response.text else None
            if text:
                return text
        except Exception as e:
            err_str = str(e)
            print(f"[Gemini] Attempt {attempt + 1} error: {err_str[:200]}")
            # Retry only on 503/overload/unavailable errors
            if attempt < 2 and ("503" in err_str or "UNAVAILABLE" in err_str or "overload" in err_str.lower()):
                time.sleep(1.5 * (attempt + 1))
                continue
            # On other errors or final attempt, give up
            break

    return None



# -- Route ---------------------------------------------------------------------
@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest, user: models.User = Depends(get_current_user)):
    # 1. Try Gemini first (real AI conversational response)
    gemini_reply = _ask_gemini(request.message, request.history)
    if gemini_reply:
        return ChatResponse(reply=gemini_reply, source="gemini")

    # 2. Fallback: training-data keyword match
    training_reply = _find_training_reply(request.message)
    if training_reply:
        return ChatResponse(reply=training_reply, source="training")

    # 3. Final fallback
    return ChatResponse(reply=random.choice(FALLBACK_RESPONSES), source="fallback")
