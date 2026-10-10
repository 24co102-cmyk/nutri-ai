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
    results = db.query(models.Food).filter(models.Food.name.ilike(f"%{q}%")).all()
    if not results:
        raise HTTPException(status_code=404, detail="No foods found matching query")
    return results
