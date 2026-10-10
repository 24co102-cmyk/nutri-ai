import sys
from pathlib import Path

# Add the project root (one level above this script's directory) to sys.path
project_root = Path(__file__).resolve().parent.parent
sys.path.append(str(project_root))

from sqlalchemy.orm import Session

from backend.app.database import SessionLocal, engine, Base
from backend.app import models

# Ensure tables exist
Base.metadata.create_all(bind=engine)

# List of food dicts (name, serving_size, calories, protein, carbs, fat)
FOODS = [
    {"name": "Eggs", "serving_size": "1 large (50g)", "calories": 78, "protein": 6.3, "carbs": 0.6, "fat": 5.3},
    {"name": "Milk", "serving_size": "1 cup (240ml)", "calories": 103, "protein": 8.0, "carbs": 12.0, "fat": 2.4},
    {"name": "Oats", "serving_size": "1/2 cup dry (40g)", "calories": 154, "protein": 5.0, "carbs": 27.0, "fat": 3.0},
    {"name": "Banana", "serving_size": "1 medium (118g)", "calories": 105, "protein": 1.3, "carbs": 27.0, "fat": 0.4},
    {"name": "Apple", "serving_size": "1 medium (182g)", "calories": 95, "protein": 0.5, "carbs": 25.0, "fat": 0.3},
    {"name": "Rice", "serving_size": "1 cup cooked (158g)", "calories": 205, "protein": 4.3, "carbs": 44.5, "fat": 0.4},
    {"name": "Roti", "serving_size": "1 piece (30g)", "calories": 102, "protein": 2.9, "carbs": 22.0, "fat": 0.3},
    {"name": "Dal", "serving_size": "1 cup cooked (198g)", "calories": 230, "protein": 12.0, "carbs": 34.0, "fat": 5.0},
    {"name": "Paneer", "serving_size": "100g", "calories": 265, "protein": 18.0, "carbs": 6.0, "fat": 20.0},
    {"name": "Tofu", "serving_size": "100g", "calories": 76, "protein": 8.0, "carbs": 1.9, "fat": 4.8},
    {"name": "Chicken Breast", "serving_size": "100g", "calories": 165, "protein": 31.0, "carbs": 0.0, "fat": 3.6},
    {"name": "Fish", "serving_size": "100g", "calories": 206, "protein": 22.0, "carbs": 0.0, "fat": 12.0},
    {"name": "Curd", "serving_size": "1 cup (245g)", "calories": 206, "protein": 11.0, "carbs": 7.9, "fat": 11.4},
    {"name": "Greek Yogurt", "serving_size": "1 cup (240g)", "calories": 130, "protein": 23.0, "carbs": 9.0, "fat": 0.0},
    {"name": "Almonds", "serving_size": "1 oz (28g)", "calories": 164, "protein": 6.0, "carbs": 6.1, "fat": 14.2},
    {"name": "Peanuts", "serving_size": "1 oz (28g)", "calories": 161, "protein": 7.3, "carbs": 4.6, "fat": 14.0},
    {"name": "Bread", "serving_size": "1 slice (28g)", "calories": 75, "protein": 3.0, "carbs": 13.0, "fat": 1.0},
    {"name": "Potato", "serving_size": "1 medium (150g)", "calories": 110, "protein": 2.9, "carbs": 26.0, "fat": 0.1},
    {"name": "Vegetables", "serving_size": "1 cup (91g)", "calories": 50, "protein": 2.0, "carbs": 10.0, "fat": 0.2},
    {"name": "Salad", "serving_size": "1 cup (75g)", "calories": 20, "protein": 1.0, "carbs": 4.0, "fat": 0.2},
]

def seed_foods(db: Session):
    if db.query(models.Food).first():
        print("Food table already seeded, skipping.")
        return
    for f in FOODS:
        db.add(models.Food(**f))
    db.commit()
    print(f"Inserted {len(FOODS)} food items.")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_foods(db)
    finally:
        db.close()
