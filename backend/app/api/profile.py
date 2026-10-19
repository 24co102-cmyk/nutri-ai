from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# pyrefly: ignore [missing-import]
from .. import models, schemas
# pyrefly: ignore [missing-import]
from ..database import get_db
# pyrefly: ignore [missing-import]
from ..dependencies import get_current_user
# pyrefly: ignore [missing-import]
from ..utils import nutrition

router = APIRouter()

@router.get("/", response_model=schemas.ProfileOut)
def read_profile(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        profile = models.Profile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
        
    # Only calculate and commit if targets have not been computed yet
    if (profile.bmr is None or profile.daily_calorie_target is None) and (
        profile.age and profile.sex and profile.height_cm and profile.weight_kg and profile.activity_level and profile.goal
    ):
        bmr = nutrition.calculate_bmr(profile.sex, profile.weight_kg, profile.height_cm, profile.age)
        daily = nutrition.calculate_daily_calorie_target(bmr, profile.activity_level, profile.goal)
        macros = nutrition.calculate_macro_targets(daily)
        profile.bmr = bmr
        profile.daily_calorie_target = daily
        profile.protein_target = macros["protein"]
        profile.carbs_target = macros["carbs"]
        profile.fat_target = macros["fat"]
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/", response_model=schemas.ProfileOut)
def update_profile(update: schemas.ProfileUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        # Create new profile if missing
        profile = models.Profile(user_id=current_user.id)
        db.add(profile)
        db.flush()
    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    # Recalculate nutrition targets when enough data present
    if profile.age and profile.sex and profile.height_cm and profile.weight_kg and profile.activity_level and profile.goal:
        bmr = nutrition.calculate_bmr(profile.sex, profile.weight_kg, profile.height_cm, profile.age)
        daily = nutrition.calculate_daily_calorie_target(bmr, profile.activity_level, profile.goal)
        macros = nutrition.calculate_macro_targets(daily)
        profile.bmr = bmr
        profile.daily_calorie_target = daily
        profile.protein_target = macros["protein"]
        profile.carbs_target = macros["carbs"]
        profile.fat_target = macros["fat"]
    db.commit()
    db.refresh(profile)
    return profile
