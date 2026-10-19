from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

# pyrefly: ignore [missing-import]
from .. import models, schemas
# pyrefly: ignore [missing-import]
from ..database import get_db
# pyrefly: ignore [missing-import]
from ..dependencies import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.FoodOut])
def list_foods(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    foods = db.query(models.Food).offset(skip).limit(limit).all()
    return foods

@router.get("/search", response_model=List[schemas.FoodOut])
def search_foods(q: str = Query(..., min_length=1), db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    results = db.query(models.Food).filter(models.Food.name.ilike(f"%{q}%")).limit(50).all()
    return results

@router.get("/{food_id}", response_model=schemas.FoodOut)
def get_food(food_id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    food = db.query(models.Food).filter(models.Food.id == food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food item not found")
    return food

@router.post("/", response_model=schemas.FoodOut, status_code=201)
def create_food(food_in: schemas.FoodCreate, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    existing = db.query(models.Food).filter(models.Food.name.ilike(food_in.name.strip())).first()
    if existing:
        return existing
    new_food = models.Food(
        name=food_in.name.strip(),
        serving_size=food_in.serving_size or "100g",
        calories=food_in.calories or 0.0,
        protein=food_in.protein or 0.0,
        carbs=food_in.carbs or 0.0,
        fat=food_in.fat or 0.0,
        sugar=food_in.sugar or "Not available",
        sodium=food_in.sodium or "Not available",
        ingredients=food_in.ingredients or "Not available",
        allergens=food_in.allergens or "Not available",
        nutrition_grade=food_in.nutrition_grade or "Not available",
    )
    db.add(new_food)
    db.commit()
    db.refresh(new_food)
    return new_food

