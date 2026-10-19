from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from datetime import datetime, timezone

from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_user

router = APIRouter()

def _now_utc() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)

def _parse_date(date_val):
    if not date_val:
        return _now_utc()
    if isinstance(date_val, datetime):
        return date_val
    try:
        return datetime.fromisoformat(str(date_val).replace("Z", "+00:00"))
    except Exception:
        return _now_utc()

@router.post("/", response_model=schemas.MealOut)
def create_meal(meal_in: schemas.MealCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    meal_date = _parse_date(meal_in.date)
    new_meal = models.Meal(
        user_id=user.id,
        meal_type=meal_in.meal_type,
        date=meal_date,
        mood=meal_in.mood,
    )
    db.add(new_meal)
    db.flush()  # get new_meal.id

    total_cal = total_prot = total_carb = total_fat = 0.0
    for item in meal_in.items:
        food = None
        if item.food_id and item.food_id > 0:
            food = db.query(models.Food).filter(models.Food.id == item.food_id).first()
        if not food and item.food_name:
            food = db.query(models.Food).filter(models.Food.name.ilike(item.food_name.strip())).first()
            if not food:
                food = models.Food(
                    name=item.food_name.strip(),
                    serving_size="1 serving",
                    calories=item.calories or 0.0,
                    protein=item.protein or 0.0,
                    carbs=item.carbs or 0.0,
                    fat=item.fat or 0.0,
                )
                db.add(food)
                db.flush()
        if not food:
            food = db.query(models.Food).first()
            if not food:
                food = models.Food(name="Custom Food", calories=100.0, protein=5.0, carbs=15.0, fat=2.0)
                db.add(food)
                db.flush()

        qty = item.quantity if (item.quantity and item.quantity > 0) else 1.0

        if item.calories is not None and item.calories >= 0:
            cal = float(item.calories)
            prot = float(item.protein or 0.0)
            carb = float(item.carbs or 0.0)
            fat = float(item.fat or 0.0)
        else:
            cal = (food.calories or 0.0) * qty
            prot = (food.protein or 0.0) * qty
            carb = (food.carbs or 0.0) * qty
            fat = (food.fat or 0.0) * qty

        total_cal += cal
        total_prot += prot
        total_carb += carb
        total_fat += fat

        meal_item = models.MealItem(
            meal_id=new_meal.id,
            food_id=food.id,
            food_name=item.food_name or food.name,
            quantity=qty,
            calories=round(cal, 1),
            protein=round(prot, 1),
            carbs=round(carb, 1),
            fat=round(fat, 1),
        )
        db.add(meal_item)

    new_meal.total_calories = round(total_cal, 1)
    new_meal.total_protein = round(total_prot, 1)
    new_meal.total_carbs = round(total_carb, 1)
    new_meal.total_fat = round(total_fat, 1)
    db.commit()
    db.refresh(new_meal)
    return new_meal

@router.get("/", response_model=List[schemas.MealOut])
def list_meals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    meals = (
        db.query(models.Meal)
        .options(joinedload(models.Meal.items))
        .filter(models.Meal.user_id == user.id)
        .order_by(models.Meal.date.desc(), models.Meal.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return meals

@router.get("/{meal_id}", response_model=schemas.MealOut)
def get_meal(meal_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    meal = (
        db.query(models.Meal)
        .options(joinedload(models.Meal.items))
        .filter(models.Meal.id == meal_id, models.Meal.user_id == user.id)
        .first()
    )
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    return meal

@router.put("/{meal_id}", response_model=schemas.MealOut)
def update_meal(meal_id: int, meal_update: schemas.MealUpdate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    meal = (
        db.query(models.Meal)
        .options(joinedload(models.Meal.items))
        .filter(models.Meal.id == meal_id, models.Meal.user_id == user.id)
        .first()
    )
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    if meal_update.meal_type is not None:
        meal.meal_type = meal_update.meal_type
    if meal_update.date is not None:
        meal.date = _parse_date(meal_update.date)
    if meal_update.mood is not None:
        meal.mood = meal_update.mood

    if meal_update.items is not None:
        # Replace line items
        for old_item in list(meal.items):
            db.delete(old_item)
        db.flush()

        total_cal = total_prot = total_carb = total_fat = 0.0
        for item in meal_update.items:
            food = None
            if item.food_id and item.food_id > 0:
                food = db.query(models.Food).filter(models.Food.id == item.food_id).first()
            if not food and item.food_name:
                food = db.query(models.Food).filter(models.Food.name.ilike(item.food_name.strip())).first()
                if not food:
                    food = models.Food(
                        name=item.food_name.strip(),
                        serving_size="1 serving",
                        calories=item.calories or 0.0,
                        protein=item.protein or 0.0,
                        carbs=item.carbs or 0.0,
                        fat=item.fat or 0.0,
                    )
                    db.add(food)
                    db.flush()
            if not food:
                food = db.query(models.Food).first()

            qty = item.quantity if (item.quantity and item.quantity > 0) else 1.0
            if item.calories is not None and item.calories >= 0:
                cal = float(item.calories)
                prot = float(item.protein or 0.0)
                carb = float(item.carbs or 0.0)
                fat = float(item.fat or 0.0)
            else:
                cal = (food.calories or 0.0) * qty if food else 0.0
                prot = (food.protein or 0.0) * qty if food else 0.0
                carb = (food.carbs or 0.0) * qty if food else 0.0
                fat = (food.fat or 0.0) * qty if food else 0.0

            total_cal += cal
            total_prot += prot
            total_carb += carb
            total_fat += fat

            meal_item = models.MealItem(
                meal_id=meal.id,
                food_id=food.id if food else 1,
                food_name=item.food_name or (food.name if food else "Meal item"),
                quantity=qty,
                calories=round(cal, 1),
                protein=round(prot, 1),
                carbs=round(carb, 1),
                fat=round(fat, 1),
            )
            db.add(meal_item)

        meal.total_calories = round(total_cal, 1)
        meal.total_protein = round(total_prot, 1)
        meal.total_carbs = round(total_carb, 1)
        meal.total_fat = round(total_fat, 1)
    else:
        if meal_update.total_calories is not None:
            meal.total_calories = round(meal_update.total_calories, 1)
        if meal_update.total_protein is not None:
            meal.total_protein = round(meal_update.total_protein, 1)
        if meal_update.total_carbs is not None:
            meal.total_carbs = round(meal_update.total_carbs, 1)
        if meal_update.total_fat is not None:
            meal.total_fat = round(meal_update.total_fat, 1)

    db.commit()
    db.refresh(meal)
    return meal

@router.delete("/{meal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meal(meal_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    meal = db.query(models.Meal).filter(models.Meal.id == meal_id, models.Meal.user_id == user.id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    db.delete(meal)
    db.commit()
    return None

