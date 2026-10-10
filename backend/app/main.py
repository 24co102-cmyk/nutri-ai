# backend/app/main.py
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .api import profile, foods, meals, diet_plan, chat, photo, barcode, nutrilens

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nutri AI Backend", version="0.1.0")

# CORS – allow local network & mobile connections
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://192.168.1.158:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"http://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])
app.include_router(foods.router, prefix="/api/foods", tags=["foods"])
app.include_router(meals.router, prefix="/api/meals", tags=["meals"])
app.include_router(diet_plan.router, prefix="/api/diet-plan", tags=["diet-plan"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(photo.router, prefix="/api/photo", tags=["photo"])
app.include_router(barcode.router, prefix="/api/barcode", tags=["barcode"])
app.include_router(nutrilens.router, prefix="/api/nutrilens", tags=["nutrilens"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
