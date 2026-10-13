# backend/app/services/ai_tools.py
"""
NutriLens AI — Backend Application Tool Dispatcher
Allows the AI Assistant to query real database models, profile statistics,
logged meal history, diet plan generation, and barcode lookups securely.
"""

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
import httpx
from .. import models
from .project_rag import search_project_knowledge

def tool_get_user_profile(user: models.User, db: Session) -> Dict[str, Any]:
    """Retrieve the current authenticated user's physical profile and nutritional targets."""
    profile = db.query(models.Profile).filter(models.Profile.user_id == user.id).first()
    if not profile:
        return {
            "status": "profile_not_set",
            "message": "User has not yet saved body biometrics or dietary goals.",
            "defaults": {
                "daily_calorie_target": 2000,
                "protein_target_g": 130,
                "carbs_target_g": 220,
                "fat_target_g": 65
            }
        }

    return {
        "status": "success",
        "user_name": user.name,
        "age": profile.age,
        "sex": profile.sex,
        "height_cm": profile.height_cm,
        "weight_kg": profile.weight_kg,
        "activity_level": profile.activity_level or "Moderate",
        "health_goal": profile.goal or "Maintenance",
        "diet_type": profile.diet_type or "Omnivore",
        "allergies": profile.allergies or "None reported",
        "foods_to_avoid": profile.foods_to_avoid or "None",
        "bmr_kcal": round(profile.bmr, 1) if profile.bmr else None,
        "daily_calorie_target_kcal": round(profile.daily_calorie_target, 1) if profile.daily_calorie_target else 2000,
        "protein_target_g": round(profile.protein_target, 1) if profile.protein_target else 130,
        "carbs_target_g": round(profile.carbs_target, 1) if profile.carbs_target else 220,
        "fat_target_g": round(profile.fat_target, 1) if profile.fat_target else 65
    }


def tool_get_meal_history(user: models.User, db: Session, limit: int = 5) -> Dict[str, Any]:
    """Retrieve authorized meal history for the current user."""
    meals = (
        db.query(models.Meal)
        .filter(models.Meal.user_id == user.id)
        .order_by(models.Meal.date.desc(), models.Meal.id.desc())
        .limit(limit)
        .all()
    )

    if not meals:
        return {
            "status": "no_meals",
            "message": "No meals logged in database yet today.",
            "total_meals": 0
        }

    formatted_meals = []
    total_calories_consumed = 0.0
    total_protein_consumed = 0.0
    total_carbs_consumed = 0.0
    total_fat_consumed = 0.0

    for m in meals:
        items = []
        for it in (m.items or []):
            food_name = it.food.name if it.food else f"Food #{it.food_id}"
            items.append({
                "food": food_name,
                "servings": it.quantity,
                "calories": round(it.calories or 0, 1),
                "protein_g": round(it.protein or 0, 1)
            })

        cal = m.total_calories or 0.0
        prot = m.total_protein or 0.0
        carbs = m.total_carbs or 0.0
        fat = m.total_fat or 0.0

        total_calories_consumed += cal
        total_protein_consumed += prot
        total_carbs_consumed += carbs
        total_fat_consumed += fat

        formatted_meals.append({
            "meal_id": m.id,
            "meal_type": m.meal_type or "Meal",
            "date": m.date.strftime("%Y-%m-%d %H:%M") if m.date else "Today",
            "calories": round(cal, 1),
            "protein_g": round(prot, 1),
            "carbs_g": round(carbs, 1),
            "fat_g": round(fat, 1),
            "items": items
        })

    return {
        "status": "success",
        "recent_meals_count": len(meals),
        "totals_summary": {
            "calories_kcal": round(total_calories_consumed, 1),
            "protein_g": round(total_protein_consumed, 1),
            "carbs_g": round(total_carbs_consumed, 1),
            "fat_g": round(total_fat_consumed, 1)
        },
        "meals": formatted_meals
    }


def tool_search_foods(query: str, db: Session, limit: int = 5) -> Dict[str, Any]:
    """Search verified food items and nutrition per serving in SQLite database."""
    cleaned = query.strip()
    if not cleaned:
        return {"status": "error", "message": "Query string is empty"}

    results = (
        db.query(models.Food)
        .filter(models.Food.name.ilike(f"%{cleaned}%"))
        .limit(limit)
        .all()
    )

    if not results:
        return {
            "status": "not_found",
            "query": cleaned,
            "message": f"No foods found in database matching '{cleaned}'"
        }

    foods_list = []
    for f in results:
        foods_list.append({
            "id": f.id,
            "name": f.name,
            "serving_size": f.serving_size or "100g",
            "calories_kcal": f.calories,
            "protein_g": f.protein,
            "carbs_g": f.carbs,
            "fat_g": f.fat,
            "sugar": f.sugar,
            "sodium": f.sodium
        })

    return {
        "status": "success",
        "match_count": len(foods_list),
        "foods": foods_list
    }


def tool_lookup_barcode(barcode: str, db: Session) -> Dict[str, Any]:
    """Lookup a product barcode using internal registry or Open Food Facts API."""
    clean_code = barcode.strip().replace(" ", "").replace("-", "")
    if not clean_code or not clean_code.isdigit():
        return {"status": "error", "message": "Barcode must be a numeric string"}

    # 1. Check local ManagedProduct table
    local_prod = db.query(models.ManagedProduct).filter(models.ManagedProduct.barcode == clean_code).first()
    if local_prod:
        return {
            "status": "success",
            "source": "Internal Database",
            "barcode": clean_code,
            "product_name": local_prod.product_name,
            "brand": local_prod.brand_name or "Verified Brand",
            "serving_size": local_prod.serving_size or "100g",
            "nutrition_per_100g": {
                "calories_kcal": local_prod.calories,
                "protein_g": local_prod.protein,
                "carbs_g": local_prod.carbohydrates,
                "fat_g": local_prod.fat,
                "sugar_g": local_prod.sugar,
                "sodium_mg": local_prod.sodium
            }
        }

    # 2. Query Open Food Facts external API
    try:
        url = f"https://world.openfoodfacts.org/api/v2/product/{clean_code}.json"
        headers = {"User-Agent": "NutriLensAI/1.0 (support@nutrilens.app)"}
        with httpx.Client(timeout=4.0) as client:
            resp = client.get(url, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("status") == 1 and data.get("product"):
                    p = data["product"]
                    nuts = p.get("nutriments") or {}
                    cal = nuts.get("energy-kcal_100g") or nuts.get("energy-kcal") or 0
                    return {
                        "status": "success",
                        "source": "Open Food Facts",
                        "barcode": clean_code,
                        "product_name": p.get("product_name") or "Verified Product",
                        "brand": p.get("brands") or "Verified Brand",
                        "nutriscore": str(p.get("nutriscore_grade", "")).upper() or None,
                        "nutrition_per_100g": {
                            "calories_kcal": round(float(cal), 1) if cal else 0,
                            "protein_g": round(float(nuts.get("proteins_100g", 0)), 1),
                            "carbs_g": round(float(nuts.get("carbohydrates_100g", 0)), 1),
                            "fat_g": round(float(nuts.get("fat_100g", 0)), 1),
                            "sugar_g": round(float(nuts.get("sugars_100g", 0)), 1),
                            "sodium_mg": round(float(nuts.get("sodium_100g", 0)) * 1000, 1)
                        }
                    }
    except Exception as e:
        print(f"[Barcode Tool Warning]: {e}")

    return {
        "status": "not_found",
        "barcode": clean_code,
        "message": f"No product record found for barcode {clean_code}."
    }


def execute_tool(tool_name: str, args: Dict[str, Any], user: models.User, db: Session) -> Dict[str, Any]:
    """Secure dispatcher executing allowed backend application tools with strict argument validation."""
    if tool_name == "get_user_profile":
        return tool_get_user_profile(user, db)
    elif tool_name == "get_meal_history":
        limit = min(int(args.get("limit", 5)), 20)
        return tool_get_meal_history(user, db, limit=limit)
    elif tool_name == "search_foods":
        q = str(args.get("query", ""))
        limit = min(int(args.get("limit", 5)), 15)
        return tool_search_foods(q, db, limit=limit)
    elif tool_name == "lookup_barcode":
        code = str(args.get("barcode", ""))
        return tool_lookup_barcode(code, db)
    elif tool_name == "search_project_knowledge":
        q = str(args.get("query", ""))
        return {"status": "success", "results": search_project_knowledge(q, top_k=3)}
    else:
        return {"status": "error", "message": f"Unknown tool '{tool_name}'"}
