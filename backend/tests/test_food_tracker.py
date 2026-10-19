# backend/tests/test_food_tracker.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import base64

from app.main import app
from app.database import Base, get_db
from app import models
from app.utils.security import hash_password, create_access_token

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    db = TestingSessionLocal()
    # Seed default food
    f1 = models.Food(name="Eggs", serving_size="1 large (50g)", calories=78.0, protein=6.3, carbs=0.6, fat=5.3)
    f2 = models.Food(name="Rice", serving_size="1 cup (158g)", calories=205.0, protein=4.3, carbs=44.5, fat=0.4)
    db.add_all([f1, f2])
    db.commit()
    db.close()
    yield
    app.dependency_overrides.pop(get_db, None)
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def test_user_token():
    db = TestingSessionLocal()
    user = models.User(
        name="Food User",
        email="foodie@example.com",
        hashed_password=hash_password("secret123"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(data={"sub": user.email, "user_id": user.id})
    user_id = user.id
    db.close()
    return token, user_id

@pytest.fixture
def other_user_token():
    db = TestingSessionLocal()
    user = models.User(
        name="Other User",
        email="other_foodie@example.com",
        hashed_password=hash_password("secret123"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(data={"sub": user.email, "user_id": user.id})
    user_id = user.id
    db.close()
    return token, user_id

client = TestClient(app)

def test_foods_list_and_search(test_user_token):
    token, _ = test_user_token
    headers = {"Authorization": f"Bearer {token}"}

    # List foods
    res = client.get("/api/foods/", headers=headers)
    assert res.status_code == 200
    foods = res.json()
    assert len(foods) >= 2
    names = [f["name"] for f in foods]
    assert "Eggs" in names
    assert "Rice" in names

    # Search foods
    res_search = client.get("/api/foods/search?q=egg", headers=headers)
    assert res_search.status_code == 200
    results = res_search.json()
    assert len(results) == 1
    assert results[0]["name"] == "Eggs"

def test_create_custom_food(test_user_token):
    token, _ = test_user_token
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "name": "Quinoa Bowl",
        "serving_size": "150g",
        "calories": 220.0,
        "protein": 8.0,
        "carbs": 38.0,
        "fat": 4.5,
        "sugar": "2g",
        "sodium": "120mg",
        "ingredients": "Organic Quinoa, Sea Salt",
        "allergens": "None",
        "nutrition_grade": "A",
    }
    res = client.post("/api/foods/", json=payload, headers=headers)
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == "Quinoa Bowl"
    assert data["calories"] == 220.0
    assert data["protein"] == 8.0

    # Retrieve by ID
    food_id = data["id"]
    res_get = client.get(f"/api/foods/{food_id}", headers=headers)
    assert res_get.status_code == 200
    assert res_get.json()["name"] == "Quinoa Bowl"

def test_create_and_read_meal_with_custom_nutrition(test_user_token):
    token, _ = test_user_token
    headers = {"Authorization": f"Bearer {token}"}

    # Add meal with explicit nutrition calculations
    payload = {
        "meal_type": "Lunch",
        "date": "2026-10-19T12:30:00",
        "mood": "Energetic",
        "items": [
            {
                "food_name": "Grilled Chicken Salad",
                "quantity": 1.0,
                "calories": 350.0,
                "protein": 42.0,
                "carbs": 12.0,
                "fat": 9.0,
            }
        ],
    }
    res = client.post("/api/meals/", json=payload, headers=headers)
    assert res.status_code == 200
    meal = res.json()
    assert meal["meal_type"] == "Lunch"
    assert meal["mood"] == "Energetic"
    assert meal["total_calories"] == 350.0
    assert meal["total_protein"] == 42.0
    assert meal["total_carbs"] == 12.0
    assert meal["total_fat"] == 9.0
    assert len(meal["items"]) == 1
    assert meal["items"][0]["food_name"] == "Grilled Chicken Salad"

    meal_id = meal["id"]

    # Get single meal
    res_single = client.get(f"/api/meals/{meal_id}", headers=headers)
    assert res_single.status_code == 200
    assert res_single.json()["id"] == meal_id

    # List meals
    res_list = client.get("/api/meals/", headers=headers)
    assert res_list.status_code == 200
    assert len(res_list.json()) == 1

def test_update_meal(test_user_token):
    token, _ = test_user_token
    headers = {"Authorization": f"Bearer {token}"}

    # Create initial meal
    create_payload = {
        "meal_type": "Dinner",
        "date": "2026-10-19T19:00:00",
        "mood": "Calm",
        "items": [
            {
                "food_name": "Steamed Rice",
                "quantity": 1.0,
                "calories": 200.0,
                "protein": 4.0,
                "carbs": 44.0,
                "fat": 0.5,
            }
        ],
    }
    res_create = client.post("/api/meals/", json=create_payload, headers=headers)
    assert res_create.status_code == 200
    meal_id = res_create.json()["id"]

    # Update meal type, mood, and items
    update_payload = {
        "meal_type": "Late Dinner",
        "mood": "Happy",
        "items": [
            {
                "food_name": "Steamed Rice with Dal",
                "quantity": 1.0,
                "calories": 380.0,
                "protein": 14.0,
                "carbs": 65.0,
                "fat": 4.0,
            }
        ],
    }
    res_update = client.put(f"/api/meals/{meal_id}", json=update_payload, headers=headers)
    assert res_update.status_code == 200
    updated = res_update.json()
    assert updated["meal_type"] == "Late Dinner"
    assert updated["mood"] == "Happy"
    assert updated["total_calories"] == 380.0
    assert updated["total_protein"] == 14.0
    assert updated["items"][0]["food_name"] == "Steamed Rice with Dal"

def test_meal_strict_user_isolation(test_user_token, other_user_token):
    token_a, _ = test_user_token
    token_b, _ = other_user_token

    # User A creates a meal
    payload = {
        "meal_type": "Breakfast",
        "items": [{"food_name": "Avocado Toast", "calories": 250, "protein": 6, "carbs": 25, "fat": 12}],
    }
    res = client.post("/api/meals/", json=payload, headers={"Authorization": f"Bearer {token_a}"})
    assert res.status_code == 200
    meal_id = res.json()["id"]

    # User B tries to read User A's meal
    res_b_read = client.get(f"/api/meals/{meal_id}", headers={"Authorization": f"Bearer {token_b}"})
    assert res_b_read.status_code == 404

    # User B tries to update User A's meal
    res_b_update = client.put(
        f"/api/meals/{meal_id}",
        json={"meal_type": "Hacked"},
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert res_b_update.status_code == 404

    # User B tries to delete User A's meal
    res_b_del = client.delete(f"/api/meals/{meal_id}", headers={"Authorization": f"Bearer {token_b}"})
    assert res_b_del.status_code == 404

    # User A can delete their own meal
    res_a_del = client.delete(f"/api/meals/{meal_id}", headers={"Authorization": f"Bearer {token_a}"})
    assert res_a_del.status_code == 204

def test_photo_analyze_non_food_handling(test_user_token):
    token, _ = test_user_token
    headers = {"Authorization": f"Bearer {token}"}

    # Minimal 1x1 black pixel JPEG
    tiny_jpeg = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGNiAAAABgADNjd8qAAAAABJRU5ErkJggg=="
    payload = {"image_base64": f"data:image/png;base64,{tiny_jpeg}"}
    res = client.post("/api/photo/analyze", json=payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "success" in data
    assert "is_food" in data
    assert "disclaimer" in data
    # Empty/solid pixel is either not food or triggers graceful failure
    if not data["is_food"]:
        assert len(data["detected_items"]) == 0
        assert data["message"] is not None
