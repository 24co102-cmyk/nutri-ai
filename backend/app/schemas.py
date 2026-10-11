from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List, Union, Any
from datetime import datetime

# Auth
class UserCreate(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[int] = None

# Profile
class ProfileBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    age: Optional[int] = None
    sex: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    activity_level: Optional[str] = None
    goal: Optional[str] = None
    health_goal: Optional[str] = None
    diet_type: Optional[str] = None
    allergies: Optional[str] = None
    foods_to_avoid: Optional[str] = None
    preferred_cuisine: Optional[str] = None

class ProfileUpdate(ProfileBase):
    pass

class ProfileOut(ProfileBase):
    model_config = ConfigDict(from_attributes=True)

    bmr: Optional[float] = None
    daily_calorie_target: Optional[float] = None
    protein_target: Optional[float] = None
    carbs_target: Optional[float] = None
    fat_target: Optional[float] = None
    protein_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fat_g: Optional[float] = None
    bmi: Optional[float] = None

# Food
class FoodOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    serving_size: Optional[str] = None
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None

# Meal
class MealItemCreate(BaseModel):
    food_id: int
    quantity: float = 1.0

class MealCreate(BaseModel):
    meal_type: str
    items: List[MealItemCreate]
    date: Optional[Union[datetime, str, Any]] = None

class MealOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    meal_type: str
    date: Optional[Union[datetime, str, Any]] = None
    total_calories: Optional[float] = 0
    total_protein: Optional[float] = 0
    total_carbs: Optional[float] = 0
    total_fat: Optional[float] = 0
    items: List[MealItemCreate] = []

# DietPlan (simplified)
class DietPlanOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    description: Optional[str] = None
    created_at: Optional[Union[datetime, str, Any]] = None


# Managed Product Schemas (20-Product Database with Deterministic Barcodes)
class ManagedProductCreate(BaseModel):
    productName: str
    brandName: Optional[str] = ""
    category: Optional[str] = ""
    servingSize: Optional[str] = ""
    calories: Optional[float] = 0.0
    protein: Optional[float] = 0.0
    carbohydrates: Optional[float] = 0.0
    fat: Optional[float] = 0.0
    sugar: Optional[float] = 0.0
    fiber: Optional[float] = 0.0
    sodium: Optional[float] = 0.0
    ingredients: Optional[List[str]] = []
    allergens: Optional[List[str]] = []
    description: Optional[str] = ""

class ManagedProductUpdate(BaseModel):
    productName: Optional[str] = None
    brandName: Optional[str] = None
    category: Optional[str] = None
    servingSize: Optional[str] = None
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbohydrates: Optional[float] = None
    fat: Optional[float] = None
    sugar: Optional[float] = None
    fiber: Optional[float] = None
    sodium: Optional[float] = None
    ingredients: Optional[List[str]] = None
    allergens: Optional[List[str]] = None
    description: Optional[str] = None

class ManagedProductOut(BaseModel):
    serialNumber: int
    barcode: str
    productName: str
    brandName: str = ""
    category: str = ""
    servingSize: str = ""
    calories: float = 0.0
    protein: float = 0.0
    carbohydrates: float = 0.0
    fat: float = 0.0
    sugar: float = 0.0
    fiber: float = 0.0
    sodium: float = 0.0
    ingredients: List[str] = []
    allergens: List[str] = []
    description: str = ""

