import sys
import os
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.project_rag import search_project_knowledge
from app.services.ai_tools import execute_tool
from app.database import SessionLocal
from app import models
from app.api.chat import _detect_tools_and_context, _offline_fallback_response, ChatRequest, chat

def test_project_rag_retrieval_barcode():
    results = search_project_knowledge("How is BarcodeScan.tsx implemented?")
    assert len(results) > 0
    top = results[0]
    assert "BarcodeScan.tsx" in top["file_path"]
    assert top["score"] > 20

def test_project_rag_retrieval_routes():
    results = search_project_knowledge("What routes exist in App.tsx?")
    assert len(results) > 0
    assert any("App.tsx" in r["file_path"] for r in results)

def test_project_rag_retrieval_models():
    results = search_project_knowledge("What SQLAlchemy models are in models.py?")
    assert len(results) > 0
    assert any("models.py" in r["file_path"] for r in results)

def test_ai_tools_user_profile():
    db = SessionLocal()
    user = db.query(models.User).first()
    res = execute_tool("get_user_profile", {}, user, db)
    assert res["status"] in ["success", "profile_not_set"]
    db.close()

def test_ai_tools_food_search():
    db = SessionLocal()
    user = db.query(models.User).first()
    res = execute_tool("search_foods", {"query": "Chicken", "limit": 3}, user, db)
    assert res["status"] == "success"
    assert len(res["foods"]) > 0
    assert any("Chicken" in f["name"] for f in res["foods"])
    db.close()

def test_ai_tools_unknown_tool():
    db = SessionLocal()
    user = db.query(models.User).first()
    res = execute_tool("invalid_destructive_action", {}, user, db)
    assert res["status"] == "error"
    db.close()

def test_intent_detection_project_query():
    db = SessionLocal()
    user = db.query(models.User).first()
    tools_used, sources, ctx = _detect_tools_and_context("Show me the code for BarcodeScan.tsx", user, db)
    assert "search_project_knowledge" in tools_used
    assert len(sources) > 0
    assert "PROJECT CODEBASE CONTEXT:" in ctx
    db.close()

def test_intent_detection_profile_query():
    db = SessionLocal()
    user = db.query(models.User).first()
    tools_used, sources, ctx = _detect_tools_and_context("What is my calorie limit and health goal?", user, db)
    assert "get_user_profile" in tools_used
    assert "AUTHENTICATED USER PROFILE:" in ctx
    db.close()

def test_offline_fallback_response():
    resp = _offline_fallback_response("hello", "", [])
    assert len(resp) > 5

if __name__ == "__main__":
    test_project_rag_retrieval_barcode()
    test_project_rag_retrieval_routes()
    test_project_rag_retrieval_models()
    test_ai_tools_user_profile()
    test_ai_tools_food_search()
    test_ai_tools_unknown_tool()
    test_intent_detection_project_query()
    test_intent_detection_profile_query()
    test_offline_fallback_response()
    print("ALL 9 AI ASSISTANT & RAG TESTS PASSED SUCCESSFULLY!")
