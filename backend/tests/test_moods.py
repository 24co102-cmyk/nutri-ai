# backend/tests/test_moods.py
import sys
from pathlib import Path
import pytest
from datetime import datetime, timedelta

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app import models, schemas
from app.utils.security import hash_password, create_access_token

client = TestClient(app)

@pytest.fixture(scope="module")
def db_session():
    db = SessionLocal()
    yield db
    db.close()

@pytest.fixture(scope="module")
def test_users(db_session):
    # Setup User A
    user_a = db_session.query(models.User).filter(models.User.email == "test_user_a@example.com").first()
    if not user_a:
        user_a = models.User(
            name="User A",
            email="test_user_a@example.com",
            hashed_password=hash_password("password123")
        )
        db_session.add(user_a)
        db_session.commit()
        db_session.refresh(user_a)

    # Setup User B
    user_b = db_session.query(models.User).filter(models.User.email == "test_user_b@example.com").first()
    if not user_b:
        user_b = models.User(
            name="User B",
            email="test_user_b@example.com",
            hashed_password=hash_password("password123")
        )
        db_session.add(user_b)
        db_session.commit()
        db_session.refresh(user_b)

    token_a = create_access_token({"user_id": user_a.id})
    token_b = create_access_token({"user_id": user_b.id})

    return {
        "user_a": user_a,
        "token_a": token_a,
        "user_b": user_b,
        "token_b": token_b,
    }


def test_unauthenticated_requests_rejected():
    """Verify that unauthenticated requests to mood endpoints are rejected with 401."""
    res1 = client.get("/api/moods/")
    assert res1.status_code == 401, f"Expected 401, got {res1.status_code}"

    res2 = client.post("/api/moods/", json={"mood": "Happy"})
    assert res2.status_code == 401, f"Expected 401, got {res2.status_code}"

    res3 = client.get("/api/moods/analytics")
    assert res3.status_code == 401, f"Expected 401, got {res3.status_code}"

    # Invalid token check
    res4 = client.get("/api/moods/", headers={"Authorization": "Bearer invalid_forged_token"})
    assert res4.status_code == 401


def test_create_and_read_mood_entry(test_users):
    """Verify authenticated user can create a mood check-in and read it back."""
    headers = {"Authorization": f"Bearer {test_users['token_a']}"}

    payload = {
        "mood": "Calm",
        "intensity": 4,
        "duration": "1-3 hours",
        "tags": ["meditation", "sleep", "study"],
        "journal_note": "Morning breathing exercise helped restore focus.",
        "hunger_level": "Low",
        "water_intake": 4,
        "sleep_hours": 7.5
    }

    res = client.post("/api/moods/", json=payload, headers=headers)
    assert res.status_code == 201
    data = res.json()
    assert data["mood"] == "Calm"
    assert data["intensity"] == 4
    assert data["duration"] == "1-3 hours"
    assert "meditation" in data["tags"]
    assert data["user_id"] == test_users["user_a"].id
    entry_id = data["id"]

    # Retrieve single entry
    get_res = client.get(f"/api/moods/{entry_id}", headers=headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == entry_id


def test_validation_constraints(test_users):
    """Verify validation: reject invalid mood labels and invalid intensity."""
    headers = {"Authorization": f"Bearer {test_users['token_a']}"}

    # Invalid mood label
    res1 = client.post("/api/moods/", json={"mood": "SuperEcstatic"}, headers=headers)
    assert res1.status_code == 400
    assert "Invalid mood" in res1.json()["detail"]

    # Intensity out of range (> 5)
    res2 = client.post("/api/moods/", json={"mood": "Happy", "intensity": 7}, headers=headers)
    assert res2.status_code in [400, 422]

    # Intensity out of range (< 1)
    res3 = client.post("/api/moods/", json={"mood": "Happy", "intensity": 0}, headers=headers)
    assert res3.status_code in [400, 422]


def test_update_and_delete_mood_entry(test_users):
    """Verify updating and deleting a mood entry."""
    headers = {"Authorization": f"Bearer {test_users['token_a']}"}

    # Create entry to modify
    create_res = client.post("/api/moods/", json={"mood": "Energetic", "intensity": 3}, headers=headers)
    assert create_res.status_code == 201
    entry_id = create_res.json()["id"]

    # Update entry
    patch_res = client.patch(
        f"/api/moods/{entry_id}",
        json={"mood": "Happy", "intensity": 5, "journal_note": "Energy transformed into great progress!"},
        headers=headers
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["mood"] == "Happy"
    assert patch_res.json()["intensity"] == 5
    assert patch_res.json()["journal_note"] == "Energy transformed into great progress!"

    # Delete entry
    del_res = client.delete(f"/api/moods/{entry_id}", headers=headers)
    assert del_res.status_code == 204

    # Verify deleted
    get_res = client.get(f"/api/moods/{entry_id}", headers=headers)
    assert get_res.status_code == 404


def test_strict_user_data_isolation(test_users):
    """Verify User A cannot read, edit, or delete User B's entries."""
    headers_a = {"Authorization": f"Bearer {test_users['token_a']}"}
    headers_b = {"Authorization": f"Bearer {test_users['token_b']}"}

    # User B creates a private entry
    b_res = client.post(
        "/api/moods/",
        json={"mood": "Anxious", "intensity": 4, "journal_note": "User B confidential thoughts"},
        headers=headers_b
    )
    assert b_res.status_code == 201
    b_entry_id = b_res.json()["id"]

    # User A tries to read User B's entry
    read_attempt = client.get(f"/api/moods/{b_entry_id}", headers=headers_a)
    assert read_attempt.status_code == 404, "User A should not be able to read User B's entry"

    # User A tries to edit User B's entry
    edit_attempt = client.patch(f"/api/moods/{b_entry_id}", json={"mood": "Happy"}, headers=headers_a)
    assert edit_attempt.status_code == 404, "User A should not be able to edit User B's entry"

    # User A tries to delete User B's entry
    delete_attempt = client.delete(f"/api/moods/{b_entry_id}", headers=headers_a)
    assert delete_attempt.status_code == 404, "User A should not be able to delete User B's entry"

    # User A's listing should not contain User B's entry
    list_a = client.get("/api/moods/", headers=headers_a).json()
    assert not any(e["id"] == b_entry_id for e in list_a)


def test_mood_analytics(test_users, db_session):
    """Verify analytics calculation against known records."""
    headers = {"Authorization": f"Bearer {test_users['token_a']}"}

    # Clean existing user A entries for deterministic test
    db_session.query(models.MoodEntry).filter(models.MoodEntry.user_id == test_users["user_a"].id).delete()
    db_session.commit()

    # Seed 3 known entries: 2 Happy (intensity 4), 1 Sad (intensity 2)
    client.post("/api/moods/", json={"mood": "Happy", "intensity": 4, "tags": ["exercise"]}, headers=headers)
    client.post("/api/moods/", json={"mood": "Happy", "intensity": 4, "tags": ["exercise", "social interaction"]}, headers=headers)
    client.post("/api/moods/", json={"mood": "Sad", "intensity": 2, "tags": ["sleep"]}, headers=headers)

    analytics_res = client.get("/api/moods/analytics?days=7", headers=headers)
    assert analytics_res.status_code == 200
    data = analytics_res.json()

    assert data["total_checkins"] == 3
    # Average intensity: (4 + 4 + 2) / 3 = 3.33 -> 3.3
    assert data["average_intensity"] == 3.3
    assert data["most_frequent_mood"] == "Happy"
    assert data["mood_distribution"]["Happy"] == 2
    assert data["mood_distribution"]["Sad"] == 1
    assert data["mood_distribution"]["Calm"] == 0
    assert len(data["intensity_trends"]) >= 1


def test_food_mood_connection(test_users):
    """Verify food & mood connection endpoint."""
    headers = {"Authorization": f"Bearer {test_users['token_a']}"}

    res = client.get("/api/moods/food-connection?days=30", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "total_moods_analyzed" in data
    assert "insights" in data
    assert isinstance(data["insights"], list)


def test_ai_insights_resilience(test_users):
    """Verify AI insights endpoint succeeds and provides supportive guidance."""
    headers = {"Authorization": f"Bearer {test_users['token_a']}"}

    res = client.post("/api/moods/insights", json={"days": 14}, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "summary" in data
    assert "patterns" in data
    assert "wellness_suggestions" in data
    assert len(data["wellness_suggestions"]) >= 1
    assert "disclaimer" in data
    assert data["source"] in ["gemini", "rule_based"]


def test_analyze_journal_text(test_users):
    """Verify text analysis identifies broad emotional themes and returns non-diagnostic reflection."""
    headers = {"Authorization": f"Bearer {test_users['token_a']}"}

    sample_text = "I had a hectic day full of intense deadlines and lots of stress from exams."
    res = client.post("/api/moods/analyze-text", json={"text": sample_text}, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["suggested_mood"] in schemas.VALID_MOODS
    assert "disclaimer" in data
    assert len(data["emotional_themes"]) >= 1


def test_database_persistence(test_users):
    """Verify persistence across separate database queries."""
    headers = {"Authorization": f"Bearer {test_users['token_a']}"}

    res = client.post(
        "/api/moods/",
        json={"mood": "Frustrated", "intensity": 3, "journal_note": "Testing persistent database commit"},
        headers=headers
    )
    assert res.status_code == 201
    entry_id = res.json()["id"]

    # Open completely new independent session
    new_db = SessionLocal()
    saved = new_db.query(models.MoodEntry).filter(models.MoodEntry.id == entry_id).first()
    assert saved is not None
    assert saved.mood == "Frustrated"
    assert saved.journal_note == "Testing persistent database commit"
    new_db.close()
