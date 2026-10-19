from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List, Union, Any, Dict
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
class FoodBase(BaseModel):
    name: str
    serving_size: Optional[str] = None
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None
    sugar: Optional[str] = "Not available"
    sodium: Optional[str] = "Not available"
    ingredients: Optional[str] = "Not available"
    allergens: Optional[str] = "Not available"
    nutrition_grade: Optional[str] = "Not available"
    category: Optional[str] = None
    fiber: Optional[float] = None
    notes: Optional[str] = None
    image_file: Optional[str] = None
    aliases: Optional[str] = None
    catalog_id: Optional[str] = None

class FoodCreate(FoodBase):
    pass

class FoodOut(FoodBase):
    model_config = ConfigDict(from_attributes=True)
    id: int

# Meal
class MealItemCreate(BaseModel):
    food_id: Optional[int] = None
    food_name: Optional[str] = None
    quantity: float = 1.0
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None

class MealItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    food_id: int
    food_name: Optional[str] = None
    quantity: Optional[float] = 1.0
    calories: Optional[float] = 0.0
    protein: Optional[float] = 0.0
    carbs: Optional[float] = 0.0
    fat: Optional[float] = 0.0

class MealCreate(BaseModel):
    meal_type: str
    items: List[MealItemCreate]
    date: Optional[Union[datetime, str, Any]] = None
    mood: Optional[str] = None

class MealUpdate(BaseModel):
    meal_type: Optional[str] = None
    date: Optional[Union[datetime, str, Any]] = None
    mood: Optional[str] = None
    total_calories: Optional[float] = None
    total_protein: Optional[float] = None
    total_carbs: Optional[float] = None
    total_fat: Optional[float] = None
    items: Optional[List[MealItemCreate]] = None

class MealOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    meal_type: str
    date: Optional[Union[datetime, str, Any]] = None
    mood: Optional[str] = None
    total_calories: Optional[float] = 0
    total_protein: Optional[float] = 0
    total_carbs: Optional[float] = 0
    total_fat: Optional[float] = 0
    items: List[MealItemOut] = []

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


# ── Emotion & Mood Tracking Schemas ──────────────────────────────────────────

VALID_MOODS = [
    "Happy", "Calm", "Energetic", "Neutral", "Sad", 
    "Stressed", "Anxious", "Tired", "Frustrated"
]

class LinkedMealSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    meal_type: Optional[str] = None
    total_calories: Optional[float] = 0.0
    date: Optional[Union[datetime, str, Any]] = None

class MoodEntryCreate(BaseModel):
    mood: str = Field(..., description="Primary mood label")
    intensity: Optional[int] = Field(default=None, ge=1, le=5, description="Intensity rating 1-5")
    duration: Optional[str] = Field(default=None, description="How long the mood has been present")
    tags: Optional[List[str]] = Field(default=[], description="Context tags e.g. study, work, sleep")
    journal_note: Optional[str] = Field(default=None, max_length=3000, description="Optional private journal note")
    meal_id: Optional[int] = Field(default=None, description="Optional associated meal ID")
    hunger_level: Optional[str] = Field(default=None, description="Hunger level e.g. Low, Moderate, High")
    cravings: Optional[str] = Field(default=None, description="Cravings e.g. Sweets, Salty, None")
    water_intake: Optional[int] = Field(default=None, ge=0, le=50, description="Glasses of water")
    sleep_hours: Optional[float] = Field(default=None, ge=0, le=24, description="Hours of sleep")
    date: Optional[Union[datetime, str, Any]] = Field(default=None, description="Entry timestamp")

class MoodEntryUpdate(BaseModel):
    mood: Optional[str] = None
    intensity: Optional[int] = Field(default=None, ge=1, le=5)
    duration: Optional[str] = None
    tags: Optional[List[str]] = None
    journal_note: Optional[str] = Field(default=None, max_length=3000)
    meal_id: Optional[int] = None
    hunger_level: Optional[str] = None
    cravings: Optional[str] = None
    water_intake: Optional[int] = Field(default=None, ge=0, le=50)
    sleep_hours: Optional[float] = Field(default=None, ge=0, le=24)
    date: Optional[Union[datetime, str, Any]] = None

class MoodEntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    mood: str
    intensity: Optional[int] = None
    duration: Optional[str] = None
    tags: List[str] = []
    journal_note: Optional[str] = None
    meal_id: Optional[int] = None
    meal: Optional[LinkedMealSummary] = None
    hunger_level: Optional[str] = None
    cravings: Optional[str] = None
    water_intake: Optional[int] = None
    sleep_hours: Optional[float] = None
    date: Optional[Union[datetime, str, Any]] = None
    created_at: Optional[Union[datetime, str, Any]] = None
    updated_at: Optional[Union[datetime, str, Any]] = None

class MoodAnalyticsOut(BaseModel):
    total_checkins: int
    average_intensity: Optional[float] = None
    mood_distribution: Dict[str, int]
    most_frequent_mood: Optional[str] = None
    intensity_trends: List[Dict[str, Any]]
    top_tags: List[Dict[str, Any]]
    date_range: Dict[str, Optional[str]]

class FoodMoodCorrelationOut(BaseModel):
    total_moods_analyzed: int
    total_meals_analyzed: int
    linked_meals_count: int
    mood_calorie_averages: Dict[str, Dict[str, Any]]
    hunger_distribution: Dict[str, int]
    cravings_distribution: Dict[str, int]
    insights: List[str]

class AIInsightsRequest(BaseModel):
    days: Optional[int] = Field(default=14, ge=1, le=90)
    focus: Optional[str] = None

class AIInsightsResponse(BaseModel):
    summary: str
    patterns: List[str]
    wellness_suggestions: List[str]
    disclaimer: str
    data_points_analyzed: int
    source: str  # "gemini" | "rule_based"

class AnalyzeTextRequest(BaseModel):
    text: str = Field(..., min_length=2, max_length=3000)

class AnalyzeTextResponse(BaseModel):
    suggested_mood: str
    confidence_label: str
    emotional_themes: List[str]
    sentiment_score: Optional[float] = None
    explanation: str
    disclaimer: str


