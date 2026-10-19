from __future__ import annotations
from typing import Optional, List
from datetime import datetime, timezone
from sqlalchemy import Integer, String, Float, Boolean, ForeignKey, DateTime, Table, Column
from sqlalchemy.orm import relationship, Mapped, mapped_column
from .database import Base

def utc_now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)

# Association table for many‑to‑many between DietPlan and Meal
dietplan_meal_assoc = Table(
    "dietplan_meal_assoc",
    Base.metadata,
    Column("dietplan_id", Integer, ForeignKey("diet_plans.id"), primary_key=True),
    Column("meal_id", Integer, ForeignKey("meals.id"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    profile: Mapped[Optional[Profile]] = relationship("Profile", uselist=False, back_populates="user")
    meals: Mapped[List[Meal]] = relationship("Meal", back_populates="user")
    diet_plans: Mapped[List[DietPlan]] = relationship("DietPlan", back_populates="user")
    chat_messages: Mapped[List[ChatMessage]] = relationship("ChatMessage", back_populates="user")
    moods: Mapped[List[MoodEntry]] = relationship("MoodEntry", back_populates="user", cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = "profiles"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), unique=True)
    age: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    sex: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # "Male" / "Female" / "Other"
    height_cm: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    weight_kg: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    activity_level: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # Sedentary, Light, Moderate, Very Active
    goal: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # Weight Loss, Maintenance, etc.
    diet_type: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # Vegetarian, Vegan, etc.
    allergies: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # comma‑separated list
    foods_to_avoid: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # comma‑separated list
    preferred_cuisine: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    # Calculated fields (stored for quick lookup)
    bmr: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    daily_calorie_target: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    protein_target: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    carbs_target: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    fat_target: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    user: Mapped[Optional[User]] = relationship("User", back_populates="profile")

class Food(Base):
    __tablename__ = "foods"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False, index=True)
    serving_size: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # e.g. "100g" or "1 cup"
    calories: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    protein: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    carbs: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    fat: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    sugar: Mapped[Optional[str]] = mapped_column(String, default="Not available")
    sodium: Mapped[Optional[str]] = mapped_column(String, default="Not available")
    ingredients: Mapped[Optional[str]] = mapped_column(String, default="Not available")
    allergens: Mapped[Optional[str]] = mapped_column(String, default="Not available")
    nutrition_grade: Mapped[Optional[str]] = mapped_column(String, default="Not available")

class Barcode(Base):
    __tablename__ = "barcodes"
    barcode: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("foods.id"), nullable=False)

    food: Mapped[Optional[Food]] = relationship("Food")

class Meal(Base):
    __tablename__ = "meals"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    meal_type: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # Breakfast, Lunch, Dinner, Snack
    date: Mapped[datetime] = mapped_column(DateTime, default=utc_now, index=True)
    total_calories: Mapped[float] = mapped_column(Float, default=0.0)
    total_protein: Mapped[float] = mapped_column(Float, default=0.0)
    total_carbs: Mapped[float] = mapped_column(Float, default=0.0)
    total_fat: Mapped[float] = mapped_column(Float, default=0.0)
    mood: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    user: Mapped[Optional[User]] = relationship("User", back_populates="meals")
    items: Mapped[List[MealItem]] = relationship("MealItem", back_populates="meal", cascade="all, delete-orphan")
    mood_entries: Mapped[List[MoodEntry]] = relationship("MoodEntry", back_populates="meal")

class MealItem(Base):
    __tablename__ = "meal_items"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    meal_id: Mapped[int] = mapped_column(Integer, ForeignKey("meals.id"), index=True)
    food_id: Mapped[int] = mapped_column(Integer, ForeignKey("foods.id"), index=True)
    food_name: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    quantity: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # number of servings
    # Denormalised nutrition for this line
    calories: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    protein: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    carbs: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    fat: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    meal: Mapped[Optional[Meal]] = relationship("Meal", back_populates="items")
    food: Mapped[Optional[Food]] = relationship("Food")

class DietPlan(Base):
    __tablename__ = "diet_plans"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, index=True)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # optional free‑text summary

    user: Mapped[Optional[User]] = relationship("User", back_populates="diet_plans")
    meals: Mapped[List[Meal]] = relationship("Meal", secondary=dietplan_meal_assoc, backref="diet_plans")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    role: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # "user" or "assistant"
    content: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=utc_now, index=True)

    user: Mapped[Optional[User]] = relationship("User", back_populates="chat_messages")

class ManagedProduct(Base):
    __tablename__ = "managed_products"
    serial_number: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    barcode: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    product_name: Mapped[str] = mapped_column(String, nullable=False)
    brand_name: Mapped[str] = mapped_column(String, default="")
    category: Mapped[str] = mapped_column(String, default="")
    serving_size: Mapped[str] = mapped_column(String, default="")
    calories: Mapped[float] = mapped_column(Float, default=0.0)
    protein: Mapped[float] = mapped_column(Float, default=0.0)
    carbohydrates: Mapped[float] = mapped_column(Float, default=0.0)
    fat: Mapped[float] = mapped_column(Float, default=0.0)
    sugar: Mapped[float] = mapped_column(Float, default=0.0)
    fiber: Mapped[float] = mapped_column(Float, default=0.0)
    sodium: Mapped[float] = mapped_column(Float, default=0.0)
    ingredients: Mapped[str] = mapped_column(String, default="[]")
    allergens: Mapped[str] = mapped_column(String, default="[]")
    description: Mapped[str] = mapped_column(String, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class MoodEntry(Base):
    __tablename__ = "mood_entries"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    mood: Mapped[str] = mapped_column(String, nullable=False, index=True)  # Happy, Calm, Energetic, Neutral, Sad, Stressed, Anxious, Tired, Frustrated
    intensity: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)  # 1 to 5
    duration: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # e.g. "< 1 hour", "1-3 hours", "Half day", "All day", "Several days"
    tags: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # comma-separated e.g. "study,work,sleep"
    journal_note: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    meal_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("meals.id", ondelete="SET NULL"), nullable=True, index=True)
    hunger_level: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # "None", "Low", "Moderate", "High", "Ravenous"
    cravings: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # "Sweets", "Salty", "Carbs", "None"
    water_intake: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)  # glasses of water
    sleep_hours: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # hours of sleep
    date: Mapped[datetime] = mapped_column(DateTime, default=utc_now, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

    user: Mapped[Optional[User]] = relationship("User", back_populates="moods")
    meal: Mapped[Optional[Meal]] = relationship("Meal", back_populates="mood_entries")

