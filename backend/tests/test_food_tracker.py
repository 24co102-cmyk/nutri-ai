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

def test_starter_food_catalog_import():
    from app.services.food_catalog import import_catalog_into_db, get_all_catalog_items
    db = TestingSessionLocal()
    initial_count = db.query(models.Food).count()
    assert initial_count >= 2

    # Import catalog
    created, updated = import_catalog_into_db(db)
    items = get_all_catalog_items()
    assert len(items) == 233
    assert created + updated >= 233

    # Ensure existing records weren't deleted
    final_count = db.query(models.Food).count()
    assert final_count >= 233

    # Check a specific catalog food
    banana = db.query(models.Food).filter(models.Food.name == "Banana").first()
    assert banana is not None
    assert banana.catalog_id == "food_0002"
    assert banana.category == "fruit"
    assert banana.fiber is not None
    assert "banana.svg" in (banana.image_file or "")

    db.close()

def test_catalog_lookup_and_normalization():
    from app.services.food_catalog import match_food_in_catalog, calculate_nutrition_for_portion

    # Exact match
    apple = match_food_in_catalog("Apple")
    assert apple is not None
    assert apple["id"] == "food_0001"

    # Plural / Stemmed
    apples = match_food_in_catalog("Apples")
    assert apples is not None
    assert apples["id"] == "food_0001"

    # Preparation prefix
    steamed_broccoli = match_food_in_catalog("Steamed Broccoli")
    assert steamed_broccoli is not None
    assert steamed_broccoli["name"] == "Broccoli"

    # Dish prefix
    bowl_biryani = match_food_in_catalog("Bowl of Chicken Biryani")
    assert bowl_biryani is not None
    assert bowl_biryani["id"] == "food_0100"

    # Non-existent item (never hallucinate)
    unknown = match_food_in_catalog("NonExistentAlienFoodDish123")
    assert unknown is None

    # Portion scaling test (150 grams of Banana)
    banana_portion = calculate_nutrition_for_portion(apples, grams=150.0, quantity_multiplier=1.0)
    assert banana_portion["serving_grams"] == 150.0
    # 52 kcal per 100g -> 150g = 78.0 kcal
    assert banana_portion["calories"] == 78.0
    assert banana_portion["image_url"] == "/food_reference_images/apple.svg"

def test_photo_analyze_catalog_matching_and_plate_totals():
    from app.api.photo import _process_detected_items

    raw_items = [
        {"name": "Apple", "serving_grams": 100, "quantity": 1.0, "confidence": 96.0},
        {"name": "Chicken biryani", "serving_grams": 200, "quantity": 1.0, "confidence": 92.0},
        {"name": "Unregistered Mystery Food", "serving_grams": 100, "quantity": 1.0, "calories": 250, "protein_g": 10, "carbs_g": 30, "fat_g": 8, "confidence": 80.0},
    ]

    detected, summary = _process_detected_items(raw_items)
    assert len(detected) == 3
    assert summary.item_count == 3
    assert summary.matched_count == 2
    assert summary.unmatched_count == 1

    # Check Apple (Verified)
    item_apple = detected[0]
    assert item_apple.name == "Apple"
    assert item_apple.matched_catalog is True
    assert item_apple.catalog_id == "food_0001"
    assert item_apple.image_url == "/food_reference_images/apple.svg"
    assert "NutriEmotion Food Reference" in item_apple.reference_source

    # Check Biryani (200g scaled)
    item_biryani = detected[1]
    assert item_biryani.name == "Chicken biryani"
    assert item_biryani.matched_catalog is True
    # 180 kcal per 100g -> 200g = 360 kcal
    assert item_biryani.calories == 360.0

    # Check Unregistered (Unverified)
    item_unreg = detected[2]
    assert item_unreg.matched_catalog is False
    assert item_unreg.catalog_id is None
    assert "AI Vision Estimate (Unverified" in item_unreg.reference_source
    assert item_unreg.image_url is None

    # Check Plate Totals
    expected_total_cal = round(item_apple.calories + item_biryani.calories + item_unreg.calories, 1)
    assert summary.total_calories == expected_total_cal

def test_photo_recalculate_endpoint(test_user_token):
    token, _ = test_user_token
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "items": [
            {
                "name": "Apple",
                "catalog_id": "food_0001",
                "serving_grams": 200.0,
                "quantity": 1.0,
            },
            {
                "name": "Custom Unverified Dish",
                "serving_grams": 150.0,
                "quantity": 1.0,
                "baseline_per_100g": {
                    "calories_kcal": 200.0,
                    "protein_g": 10.0,
                    "carbohydrates_g": 20.0,
                    "fat_g": 5.0,
                    "fiber_g": 2.0,
                    "sugar_g": 4.0,
                    "sodium_mg": 100.0,
                },
            },
        ]
    }

    res = client.post("/api/photo/recalculate", json=payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    items = data["detected_items"]
    assert len(items) == 2
    # 200g Apple = 52 * 2 = 104 kcal
    assert items[0]["calories"] == 104.0
    assert items[0]["matched_catalog"] is True
    # 150g Custom = 200 * 1.5 = 300 kcal
    assert items[1]["calories"] == 300.0
    assert items[1]["matched_catalog"] is False
    # Plate total = 104 + 300 = 404 kcal
    assert data["plate_summary"]["total_calories"] == 404.0

def test_scanned_meal_saved_to_food_diary_and_daily_totals(test_user_token):
    token, user_id = test_user_token
    headers = {"Authorization": f"Bearer {token}"}

    # Simulate logging multi-item plate identified by scanner
    plate_payload = {
        "meal_type": "Lunch",
        "date": "2026-10-19T13:00:00",
        "mood": "Energetic",
        "items": [
            {
                "food_name": "Chicken biryani",
                "quantity": 1.0,
                "calories": 360.0,
                "protein": 20.0,
                "carbs": 40.0,
                "fat": 12.0,
            },
            {
                "food_name": "Curd plain",
                "quantity": 1.0,
                "calories": 61.0,
                "protein": 3.5,
                "carbs": 4.7,
                "fat": 3.3,
            },
        ],
    }

    res_post = client.post("/api/meals/", json=plate_payload, headers=headers)
    assert res_post.status_code == 200
    created_meal = res_post.json()
    assert created_meal["meal_type"] == "Lunch"
    assert created_meal["total_calories"] == 421.0
    assert created_meal["total_protein"] == 23.5
    assert len(created_meal["items"]) == 2

    # Query Food Diary list
    res_list = client.get("/api/meals/", headers=headers)
    assert res_list.status_code == 200
    meals = res_list.json()
    assert len(meals) >= 1
    logged_meal = next(m for m in meals if m["id"] == created_meal["id"])
    assert logged_meal["total_calories"] == 421.0

def test_food_basket_gallery_listing(test_user_token):
    token, _ = test_user_token
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch full Food Basket
    res = client.get("/api/photo/basket", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["total_items"] == 233
    assert data["total_photos"] >= 40

    # Verify category counts
    cats = {c["name"]: c["count"] for c in data["categories"]}
    assert cats["All Foods"] == 233
    assert cats["Fruits"] == 30
    assert cats["Vegetables"] == 30
    assert cats["Indian Dishes"] >= 60
    assert cats["International Dishes"] >= 30
    assert cats["Protein Foods"] >= 15
    assert cats["Grains"] >= 8
    assert cats["Dairy"] >= 7
    assert cats["Snacks"] >= 15
    assert cats["Desserts"] >= 7
    assert cats["Drinks"] >= 12

    # Filter by category: Fruits
    res_fruit = client.get("/api/photo/basket?category=Fruits", headers=headers)
    assert res_fruit.status_code == 200
    fruit_data = res_fruit.json()
    assert fruit_data["displayed_items"] == 30
    assert all(it["basket_category"] == "Fruits" for it in fruit_data["items"])

    # Search for "chicken biryani"
    res_search = client.get("/api/photo/basket?q=chicken%20biryani", headers=headers)
    assert res_search.status_code == 200
    search_data = res_search.json()
    assert len(search_data["items"]) >= 1
    biryani = search_data["items"][0]
    assert "biryani" in biryani["name"].lower()
    assert biryani["has_photo"] is True
    assert biryani["download_filename"] == "chicken_biryani.jpg"

def test_food_basket_download_actions(test_user_token):
    token, _ = test_user_token
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Download real JPEG photo for Apple
    res_photo = client.get("/api/photo/basket/download?item_id=food_0001&preferred=photo", headers=headers)
    assert res_photo.status_code == 200
    assert res_photo.headers["content-type"] == "image/jpeg"
    assert 'filename="apple.jpg"' in res_photo.headers.get("content-disposition", "")
    assert len(res_photo.content) > 5000  # genuine high-res image file

    # 2. Download SVG reference card for Apple
    res_svg = client.get("/api/photo/basket/download?item_id=food_0001&preferred=svg", headers=headers)
    assert res_svg.status_code == 200
    assert res_svg.headers["content-type"] == "image/svg+xml"
    assert 'filename="apple.svg"' in res_svg.headers.get("content-disposition", "")
    assert b"<svg" in res_svg.content

    # 3. Download by direct filename
    res_direct = client.get("/api/photo/basket/download?filename=spinach.jpg", headers=headers)
    assert res_direct.status_code == 200
    assert res_direct.headers["content-type"] == "image/jpeg"
    assert len(res_direct.content) > 5000

    # 4. Unknown food item error handling
    res_404 = client.get("/api/photo/basket/download?item_id=non_existent_food_9999", headers=headers)
    assert res_404.status_code == 404


