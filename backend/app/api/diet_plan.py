from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import random

# pyrefly: ignore [missing-import]
from .. import models, schemas
# pyrefly: ignore [missing-import]
from ..database import get_db
# pyrefly: ignore [missing-import]
from ..dependencies import get_current_user

router = APIRouter()

# Simple deterministic diet plan generator
def _deterministic_plan(profile: models.Profile, foods: List[models.Food]) -> List[Dict[str, Any]]:
    # Very basic: split daily calories into 5 meals roughly
    meals_order = ["Breakfast", "Morning Snack", "Lunch", "Evening Snack", "Dinner"]
    # Target calories per meal (simple fractions)
    fractions = [0.25, 0.10, 0.30, 0.10, 0.25]
    total_cal = profile.daily_calorie_target or 2000
    plan = []
    # Filter foods based on diet_type & allergies
    avoid = set()
    if profile.allergies:
        avoid.update({a.strip().lower() for a in profile.allergies.split(',')})
    if profile.foods_to_avoid:
        avoid.update({a.strip().lower() for a in profile.foods_to_avoid.split(',')})
    # Simplistic veg/non‑veg filter
    non_veg_keywords = ["chicken", "fish", "beef", "pork", "egg", "paneer", "meat"]
    def is_allowed(food_name: str) -> bool:
        name = food_name.lower()
        if any(k in name for k in avoid):
            return False
        if profile.diet_type:
            dt = profile.diet_type.lower()
            if dt == "vegan" and ("milk" in name or "egg" in name or "cheese" in name or "paneer" in name):
                return False
            if dt == "vegetarian" and ("chicken" in name or "fish" in name or "beef" in name or "pork" in name):
                return False
        return True
    allowed_foods = [f for f in foods if is_allowed(f.name)]
    if not allowed_foods:
        raise HTTPException(status_code=400, detail="No foods available for the given preferences")
    # Random but deterministic using a seed based on user id
    random.seed(profile.user_id)
    for meal_name, frac in zip(meals_order, fractions):
        target_cal = total_cal * frac
        # Pick a random food and approximate quantity
        food = random.choice(allowed_foods)
        qty = max(0.5, round(target_cal / (food.calories or 1), 2))
        plan.append({
            "meal_type": meal_name,
            "items": [{"food_name": food.name, "serving_size": food.serving_size, "quantity": qty}],
            "estimated_calories": round(food.calories * qty, 1) if food.calories else None,
        })
    return plan

@router.post("/generate", response_model=List[Dict[str, Any]])
def generate_diet_plan(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    foods = db.query(models.Food).all()
    plan = _deterministic_plan(profile, foods)
    return plan
