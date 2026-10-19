from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List

# pyrefly: ignore [missing-import]
from .. import models, schemas
# pyrefly: ignore [missing-import]
from ..database import get_db
# pyrefly: ignore [missing-import]
from ..dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=schemas.MealOut)
def create_meal(meal_in: schemas.MealCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    # Create Meal
    new_meal = models.Meal(
        user_id=user.id,
        meal_type=meal_in.meal_type,
        date=meal_in.date if meal_in.date else None,
        mood=meal_in.mood,
    )
    db.add(new_meal)
    db.flush()  # get new_meal.id

    total_cal = total_prot = total_carb = total_fat = 0.0
    for item in meal_in.items:
        food = db.query(models.Food).filter(models.Food.id == item.food_id).first()
        if not food:
            raise HTTPException(status_code=404, detail=f"Food id {item.food_id} not found")
        qty = item.quantity
        # Calculate nutrition for this line
        cal = (food.calories or 0) * qty
        prot = (food.protein or 0) * qty
        carb = (food.carbs or 0) * qty
        fat = (food.fat or 0) * qty
        total_cal += cal
        total_prot += prot
        total_carb += carb
        total_fat += fat
        meal_item = models.MealItem(
            meal_id=new_meal.id,
            food_id=food.id,
            quantity=qty,
            calories=cal,
            protein=prot,
            carbs=carb,
            fat=fat,
        )
        db.add(meal_item)
    # Update totals on meal
    new_meal.total_calories = total_cal
    new_meal.total_protein = total_prot
    new_meal.total_carbs = total_carb
    new_meal.total_fat = total_fat
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

@router.delete("/{meal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meal(meal_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    meal = db.query(models.Meal).filter(models.Meal.id == meal_id, models.Meal.user_id == user.id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    db.delete(meal)
    db.commit()
    return None
