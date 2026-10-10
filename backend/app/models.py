from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Table
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

# Association table for many‑to‑many between DietPlan and Meal
dietplan_meal_assoc = Table(
    "dietplan_meal_assoc",
    Base.metadata,
    Column("dietplan_id", Integer, ForeignKey("diet_plans.id"), primary_key=True),
    Column("meal_id", Integer, ForeignKey("meals.id"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("Profile", uselist=False, back_populates="user")
    meals = relationship("Meal", back_populates="user")
    diet_plans = relationship("DietPlan", back_populates="user")
    chat_messages = relationship("ChatMessage", back_populates="user")

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    age = Column(Integer)
    sex = Column(String)  # "Male" / "Female" / "Other"
    height_cm = Column(Float)
    weight_kg = Column(Float)
    activity_level = Column(String)  # Sedentary, Light, Moderate, Very Active
    goal = Column(String)  # Weight Loss, Maintenance, etc.
    diet_type = Column(String)  # Vegetarian, Vegan, etc.
    allergies = Column(String)  # comma‑separated list
    foods_to_avoid = Column(String)  # comma‑separated list
    preferred_cuisine = Column(String)
    # Calculated fields (stored for quick lookup)
    bmr = Column(Float)
    daily_calorie_target = Column(Float)
    protein_target = Column(Float)
    carbs_target = Column(Float)
    fat_target = Column(Float)

    user = relationship("User", back_populates="profile")

class Food(Base):
    __tablename__ = "foods"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    serving_size = Column(String)  # e.g. "100g" or "1 cup"
    calories = Column(Float)
    protein = Column(Float)
    carbs = Column(Float)
    fat = Column(Float)
    sugar = Column(String, default="Not available")
    sodium = Column(String, default="Not available")
    ingredients = Column(String, default="Not available")
    allergens = Column(String, default="Not available")
    nutrition_grade = Column(String, default="Not available")

class Barcode(Base):
    __tablename__ = "barcodes"
    barcode = Column(String, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("foods.id"), nullable=False)

    food = relationship("Food")

class Meal(Base):
    __tablename__ = "meals"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    meal_type = Column(String)  # Breakfast, Lunch, Dinner, Snack
    date = Column(DateTime, default=datetime.utcnow)
    total_calories = Column(Float, default=0)
    total_protein = Column(Float, default=0)
    total_carbs = Column(Float, default=0)
    total_fat = Column(Float, default=0)

    user = relationship("User", back_populates="meals")
    items = relationship("MealItem", back_populates="meal", cascade="all, delete-orphan")

class MealItem(Base):
    __tablename__ = "meal_items"
    id = Column(Integer, primary_key=True, index=True)
    meal_id = Column(Integer, ForeignKey("meals.id"))
    food_id = Column(Integer, ForeignKey("foods.id"))
    quantity = Column(Float)  # number of servings
    # Denormalised nutrition for this line
    calories = Column(Float)
    protein = Column(Float)
    carbs = Column(Float)
    fat = Column(Float)

    meal = relationship("Meal", back_populates="items")
    food = relationship("Food")

class DietPlan(Base):
    __tablename__ = "diet_plans"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    description = Column(String)  # optional free‑text summary

    user = relationship("User", back_populates="diet_plans")
    meals = relationship("Meal", secondary=dietplan_meal_assoc, backref="diet_plans")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String)  # "user" or "assistant"
    content = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chat_messages")


class ManagedProduct(Base):
    __tablename__ = "managed_products"
    serial_number = Column(Integer, primary_key=True, index=True)
    barcode = Column(String, unique=True, index=True, nullable=False)
    product_name = Column(String, nullable=False)
    brand_name = Column(String, default="")
    category = Column(String, default="")
    serving_size = Column(String, default="")
    calories = Column(Float, default=0.0)
    protein = Column(Float, default=0.0)
    carbohydrates = Column(Float, default=0.0)
    fat = Column(Float, default=0.0)
    sugar = Column(Float, default=0.0)
    fiber = Column(Float, default=0.0)
    sodium = Column(Float, default=0.0)
    ingredients = Column(String, default="[]")
    allergens = Column(String, default="[]")
    description = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

