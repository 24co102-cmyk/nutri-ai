# backend/app/main.py
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, SessionLocal, Base
from . import models
from .api import profile, foods, meals, diet_plan, chat, photo, barcode, nutrilens, auth, moods
from .utils.security import hash_password

# Create all tables
Base.metadata.create_all(bind=engine)

# Auto-seed database if empty (ensures Render persistent startup without empty food tables)
def seed_initial_data():
    try:
        # 0. Migrate any missing SQLite columns safely
        with engine.connect() as conn:
            if "sqlite" in str(engine.url):
                import sqlalchemy
                for col in ["sugar", "sodium", "ingredients", "allergens", "nutrition_grade", "category", "notes", "image_file", "aliases", "catalog_id"]:
                    try:
                        conn.execute(sqlalchemy.text(f"ALTER TABLE foods ADD COLUMN {col} VARCHAR DEFAULT NULL"))
                        conn.commit()
                    except Exception:
                        pass
                try:
                    conn.execute(sqlalchemy.text("ALTER TABLE foods ADD COLUMN fiber FLOAT DEFAULT NULL"))
                    conn.commit()
                except Exception:
                    pass
                try:
                    conn.execute(sqlalchemy.text("ALTER TABLE meals ADD COLUMN mood VARCHAR DEFAULT NULL"))
                    conn.commit()
                except Exception:
                    pass
                try:
                    conn.execute(sqlalchemy.text("ALTER TABLE meal_items ADD COLUMN food_name VARCHAR DEFAULT NULL"))
                    conn.commit()
                except Exception:
                    pass
    except Exception as e:
        print(f"[Migration Warning]: {e}")

    db = SessionLocal()
    try:
        # 1. Seed core foods if table is empty
        food_count = db.query(models.Food).count()
        if food_count == 0:
            default_foods = [
                models.Food(name="Eggs", serving_size="1 large (50g)", calories=78.0, protein=6.3, carbs=0.6, fat=5.3),
                models.Food(name="Milk", serving_size="1 cup (240ml)", calories=103.0, protein=8.0, carbs=12.0, fat=2.4),
                models.Food(name="Oats", serving_size="1/2 cup dry (40g)", calories=154.0, protein=5.0, carbs=27.0, fat=3.0),
                models.Food(name="Banana", serving_size="1 medium (118g)", calories=105.0, protein=1.3, carbs=27.0, fat=0.4),
                models.Food(name="Apple", serving_size="1 medium (182g)", calories=95.0, protein=0.5, carbs=25.0, fat=0.3),
                models.Food(name="Rice", serving_size="1 cup cooked (158g)", calories=205.0, protein=4.3, carbs=44.5, fat=0.4),
                models.Food(name="Roti", serving_size="1 piece (30g)", calories=102.0, protein=2.9, carbs=22.0, fat=0.3),
                models.Food(name="Dal", serving_size="1 cup cooked (198g)", calories=230.0, protein=12.0, carbs=34.0, fat=5.0),
                models.Food(name="Paneer", serving_size="100g", calories=265.0, protein=18.0, carbs=6.0, fat=20.0),
                models.Food(name="Tofu", serving_size="100g", calories=76.0, protein=8.0, carbs=1.9, fat=4.8),
                models.Food(name="Chicken Breast", serving_size="100g", calories=165.0, protein=31.0, carbs=0.0, fat=3.6),
                models.Food(name="Fish", serving_size="100g", calories=206.0, protein=22.0, carbs=0.0, fat=12.0),
                models.Food(name="Curd", serving_size="1 cup (245g)", calories=206.0, protein=11.0, carbs=7.9, fat=11.4),
                models.Food(name="Greek Yogurt", serving_size="1 cup (240g)", calories=130.0, protein=23.0, carbs=9.0, fat=0.0),
                models.Food(name="Almonds", serving_size="1 oz (28g)", calories=164.0, protein=6.0, carbs=6.1, fat=14.2),
                models.Food(name="Peanuts", serving_size="1 oz (28g)", calories=161.0, protein=7.3, carbs=4.6, fat=14.0),
                models.Food(name="Bread", serving_size="1 slice (28g)", calories=75.0, protein=3.0, carbs=13.0, fat=1.0),
                models.Food(name="Potato", serving_size="1 medium (150g)", calories=110.0, protein=2.9, carbs=26.0, fat=0.1),
                models.Food(name="Vegetables", serving_size="1 cup (91g)", calories=50.0, protein=2.0, carbs=10.0, fat=0.2),
                models.Food(name="Salad", serving_size="1 cup (75g)", calories=20.0, protein=1.0, carbs=4.0, fat=0.2),
            ]
            db.add_all(default_foods)
            db.commit()

        # 2. Import NutriEmotion Food Reference Starter Catalog into database without deleting existing records
        try:
            from .services.food_catalog import import_catalog_into_db
            created_cat, updated_cat = import_catalog_into_db(db)
            if created_cat > 0 or updated_cat > 0:
                print(f"[Food Catalog] Imported {created_cat} new foods, enriched {updated_cat} existing records.")
        except Exception as cat_err:
            print(f"[Food Catalog Import Warning]: {cat_err}")

        # 2. Seed default demo & guest users
        demo_user = db.query(models.User).filter(models.User.email == "demo@nutrilens.app").first()
        if not demo_user:
            demo_user = models.User(
                name="Demo User",
                email="demo@nutrilens.app",
                hashed_password=hash_password("password123")
            )
            db.add(demo_user)

        guest_user = db.query(models.User).filter(models.User.email == "guest@example.com").first()
        if not guest_user:
            guest_user = models.User(
                name="Guest User",
                email="guest@example.com",
                hashed_password=hash_password("password123")
            )
            db.add(guest_user)
        elif guest_user.hashed_password == "guestpasswordhash":
            guest_user.hashed_password = hash_password("password123")

        db.commit()

    except Exception as e:
        print(f"[Startup Seed Warning]: {e}")
        db.rollback()
    finally:
        db.close()

seed_initial_data()

app = FastAPI(title="Nutri AI Backend", version="0.1.0")

# CORS – allow local network, mobile, and deployed Vercel frontend
origins = [
    "https://nutri-ai-eight-iota.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://192.168.1.158:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root and health endpoints
@app.get("/")
def root():
    return {
        "status": "online",
        "service": "NutriLens AI Backend",
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/api")
def api_root():
    return {
        "status": "online",
        "service": "NutriLens AI API",
        "version": "0.1.0"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])
app.include_router(foods.router, prefix="/api/foods", tags=["foods"])
app.include_router(meals.router, prefix="/api/meals", tags=["meals"])
app.include_router(diet_plan.router, prefix="/api/diet-plan", tags=["diet-plan"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(photo.router, prefix="/api/photo", tags=["photo"])
app.include_router(barcode.router, prefix="/api/barcode", tags=["barcode"])
app.include_router(nutrilens.router, prefix="/api/nutrilens", tags=["nutrilens"])
app.include_router(moods.router, prefix="/api/moods", tags=["moods"])

if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)

