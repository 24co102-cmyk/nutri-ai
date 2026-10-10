# backend/app/api/nutrilens.py
"""
NutriLens – Barcode Food Scanner backend API.

Endpoints:
  GET  /api/nutrilens/scan/{barcode}   – Lookup product by barcode
  POST /api/nutrilens/verdict          – AI verdict + personalized recommendation
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import httpx
import math
import time

from ..dependencies import get_current_user  # type: ignore
from ..database import get_db  # type: ignore
from .. import models  # type: ignore
from ..config import GEMINI_API_KEY  # type: ignore
from sqlalchemy.orm import Session

router = APIRouter()

# ─── Open Food Facts config ──────────────────────────────────────────────────
OFF_API = "https://world.openfoodfacts.org/api/v2/product"
OFF_CATEGORY = "https://world.openfoodfacts.org/category"
OFF_TIMEOUT = 10.0
OFF_USER_AGENT = "NutriLens-AI-HealthSuite/1.0 (contact: support@nutrilens.app)"


# ─── Response Schemas ────────────────────────────────────────────────────────
class NutrientLevel(BaseModel):
    value: float = 0
    level: str = "Low"  # Low / Moderate / High


class NutriLensProduct(BaseModel):
    found: bool = True
    barcode: str
    product_name: str = "Unknown Product"
    brand: str = "Unknown Brand"
    image: Optional[str] = None
    serving_size: str = "100g"

    # Core nutrition per 100g
    calories: float = 0
    protein: float = 0
    carbohydrates: float = 0
    fat: float = 0
    sugar: float = 0
    sodium: float = 0  # in mg
    fiber: float = 0
    saturated_fat: float = 0

    ingredients: str = ""
    allergens: list[str] = []
    categories: list[str] = []
    nutriscore_grade: Optional[str] = None

    # Health Score
    health_score: int = 0
    health_verdict: str = ""

    # Nutrient level classifications
    calories_level: str = "Moderate"
    sugar_level: str = "Moderate"
    fat_level: str = "Moderate"
    sodium_level: str = "Moderate"
    protein_level: str = "Moderate"


class NutriLensAlternative(BaseModel):
    barcode: str
    product_name: str
    brand: str
    image: Optional[str] = None
    calories: float = 0
    protein: float = 0
    sugar: float = 0
    sodium: float = 0
    health_score: int = 0


class VerdictRequest(BaseModel):
    barcode: str
    product_name: str
    calories: float = 0
    protein: float = 0
    carbohydrates: float = 0
    fat: float = 0
    sugar: float = 0
    sodium: float = 0
    fiber: float = 0
    health_score: int = 0
    ingredients: str = ""
    allergens: list[str] = []


class VerdictResponse(BaseModel):
    ai_verdict: str
    personalized_recommendation: Optional[str] = None
    source: str = "computed"  # "gemini" | "computed"


class AlternativesResponse(BaseModel):
    alternatives: list[NutriLensAlternative] = []


# ─── Utility: safe numeric extraction ────────────────────────────────────────
def _num(val, fallback: float = 0.0) -> float:
    try:
        v = float(val)
        return max(0.0, v) if not math.isnan(v) else fallback
    except (TypeError, ValueError):
        return fallback


# ─── Health Score Algorithm ──────────────────────────────────────────────────
def compute_health_score(
    calories: float,
    protein: float,
    fat: float,
    sugar: float,
    sodium_mg: float,
    fiber: float,
    saturated_fat: float,
) -> int:
    """
    Compute a 0–100 health score based on nutritional profile per 100g.
    Higher = healthier.
    """
    score = 60  # baseline

    # Protein bonus (0–15 pts)
    if protein >= 20:
        score += 15
    elif protein >= 10:
        score += 10
    elif protein >= 5:
        score += 5

    # Fiber bonus (0–10 pts)
    if fiber >= 6:
        score += 10
    elif fiber >= 3:
        score += 6
    elif fiber >= 1:
        score += 3

    # Sugar penalty (0–15 pts)
    if sugar > 20:
        score -= 15
    elif sugar > 12:
        score -= 10
    elif sugar > 5:
        score -= 5

    # Sodium penalty (0–12 pts) – sodium in mg
    if sodium_mg > 800:
        score -= 12
    elif sodium_mg > 500:
        score -= 8
    elif sodium_mg > 300:
        score -= 4

    # Saturated fat penalty (0–10 pts)
    if saturated_fat > 6:
        score -= 10
    elif saturated_fat > 3:
        score -= 6
    elif saturated_fat > 1.5:
        score -= 3

    # Calorie balance (0–8 pts)
    if calories > 400:
        score -= 8
    elif calories > 250:
        score -= 4
    elif calories < 80:
        score += 4

    return max(0, min(100, score))


def classify_level(value: float, low_threshold: float, high_threshold: float) -> str:
    if value <= low_threshold:
        return "Low"
    elif value <= high_threshold:
        return "Moderate"
    return "High"


def get_health_verdict(score: int) -> str:
    if score >= 80:
        return "✅ Excellent Choice"
    elif score >= 65:
        return "✅ Good Choice"
    elif score >= 45:
        return "⚠️ Moderate – Consume in Moderation"
    elif score >= 25:
        return "⚠️ Below Average – Limit Intake"
    return "🚫 Poor Choice – Avoid If Possible"


# ─── Gemini AI Verdict Generator ─────────────────────────────────────────────
_gemini_client = None

def _get_gemini():
    global _gemini_client
    if _gemini_client is not None:
        return _gemini_client
    if not GEMINI_API_KEY or GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
        return None
    try:
        from google import genai
        _gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        return _gemini_client
    except Exception as e:
        print(f"[NutriLens Gemini] Init failed: {e}")
        return None


def _generate_ai_verdict(product: VerdictRequest, profile_data: dict | None) -> tuple[str, str | None, str]:
    """
    Returns (ai_verdict, personalized_recommendation, source).
    Falls back to rule-based if Gemini unavailable.
    """
    client = _get_gemini()
    if client:
        try:
            from google.genai import types

            profile_context = ""
            if profile_data:
                parts = []
                if profile_data.get("age"):
                    parts.append(f"Age: {profile_data['age']}")
                if profile_data.get("weight_kg"):
                    parts.append(f"Weight: {profile_data['weight_kg']}kg")
                if profile_data.get("height_cm"):
                    parts.append(f"Height: {profile_data['height_cm']}cm")
                if profile_data.get("activity_level"):
                    parts.append(f"Activity: {profile_data['activity_level']}")
                if profile_data.get("goal"):
                    parts.append(f"Health Goal: {profile_data['goal']}")
                if profile_data.get("diet_type"):
                    parts.append(f"Diet: {profile_data['diet_type']}")
                if profile_data.get("allergies"):
                    parts.append(f"Allergies: {profile_data['allergies']}")
                if parts:
                    profile_context = "\n\nUser Health Profile:\n" + "\n".join(parts)

            prompt = f"""You are NutriLens AI, an expert nutrition advisor. Analyze this food product and give a concise health verdict.

Product: {product.product_name}
Nutrition per 100g:
- Calories: {product.calories} kcal
- Protein: {product.protein}g
- Carbohydrates: {product.carbohydrates}g
- Fat: {product.fat}g
- Sugar: {product.sugar}g
- Sodium: {product.sodium}mg
- Fiber: {product.fiber}g
- Health Score: {product.health_score}/100
- Ingredients: {product.ingredients[:300] if product.ingredients else 'Not available'}
- Allergens: {', '.join(product.allergens) if product.allergens else 'None listed'}
{profile_context}

Respond in this exact format:

VERDICT: (2-3 sentences about overall nutritional quality, key strengths and concerns)

{"PERSONALIZED: (2-3 sentences of personalized advice based on user profile)" if profile_context else ""}

Be specific, mention actual numbers. Keep it concise and actionable."""

            config = types.GenerateContentConfig(
                system_instruction="You are NutriLens AI, a concise and accurate nutrition analysis assistant.",
            )

            for attempt in range(2):
                try:
                    response = client.models.generate_content(
                        model="gemini-2.0-flash",
                        contents=prompt,
                        config=config,
                    )
                    text = response.text.strip() if response.text else None
                    if text:
                        # Parse verdict and personalized sections
                        verdict = text
                        personalized = None
                        if "VERDICT:" in text:
                            parts = text.split("PERSONALIZED:")
                            verdict = parts[0].replace("VERDICT:", "").strip()
                            if len(parts) > 1:
                                personalized = parts[1].strip()
                        elif profile_context:
                            # If no structured format, split roughly
                            personalized = None

                        return verdict, personalized, "gemini"
                except Exception as e:
                    err = str(e)
                    print(f"[NutriLens Gemini] Attempt {attempt+1}: {err[:200]}")
                    if attempt < 1 and ("503" in err or "UNAVAILABLE" in err):
                        time.sleep(1.5)
                        continue
                    break
        except Exception as e:
            print(f"[NutriLens Gemini] Import/setup error: {e}")

    # ── Fallback: rule-based verdict ──
    verdict_parts = []

    if product.health_score >= 70:
        verdict_parts.append(f"This product scores well ({product.health_score}/100) nutritionally.")
    elif product.health_score >= 45:
        verdict_parts.append(f"This product has a moderate health score ({product.health_score}/100).")
    else:
        verdict_parts.append(f"This product scores below average ({product.health_score}/100) on nutritional quality.")

    strengths = []
    concerns = []

    if product.protein >= 10:
        strengths.append(f"good protein content ({product.protein}g)")
    if product.fiber >= 3:
        strengths.append(f"decent fiber ({product.fiber}g)")
    if product.sugar <= 5:
        strengths.append("low sugar")
    if product.sodium <= 140:
        strengths.append("low sodium")

    if product.sugar > 15:
        concerns.append(f"high sugar ({product.sugar}g per 100g)")
    if product.sodium > 600:
        concerns.append(f"elevated sodium ({product.sodium}mg per 100g)")
    if product.fat > 20:
        concerns.append(f"high fat content ({product.fat}g per 100g)")
    if product.calories > 350:
        concerns.append(f"calorie-dense ({product.calories} kcal per 100g)")

    if strengths:
        verdict_parts.append(f"Strengths: {', '.join(strengths)}.")
    if concerns:
        verdict_parts.append(f"Watch out for: {', '.join(concerns)}.")

    verdict = " ".join(verdict_parts)

    personalized = None
    if profile_data and profile_data.get("goal"):
        goal = profile_data["goal"].lower()
        recs = []
        if "loss" in goal or "lose" in goal:
            if product.calories > 200:
                recs.append("Given your weight-loss goal, consume this in smaller portions.")
            if product.sugar > 10:
                recs.append("A lower-sugar alternative would better support your goals.")
        elif "gain" in goal or "muscle" in goal or "bulk" in goal:
            if product.protein < 10:
                recs.append("Consider pairing with a high-protein source to meet your muscle-gain target.")
        if profile_data.get("allergies"):
            allergens_lower = [a.lower() for a in product.allergens]
            user_allergies = [a.strip().lower() for a in profile_data["allergies"].split(",")]
            for allergy in user_allergies:
                if allergy and any(allergy in al for al in allergens_lower):
                    recs.append(f"⚠️ This product may contain '{allergy}', which is listed in your allergies.")
        if recs:
            personalized = " ".join(recs)

    return verdict, personalized, "computed"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ENDPOINTS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/scan/{barcode}", response_model=NutriLensProduct)
async def scan_barcode(barcode: str, user=Depends(get_current_user)):
    """
    Look up a food product by barcode from Open Food Facts.
    Returns normalized nutrition data with computed health score.
    """
    clean = barcode.strip().replace(" ", "")
    if not clean or len(clean) < 6 or not clean.isdigit():
        raise HTTPException(status_code=400, detail="Invalid barcode. Please enter a valid 8-14 digit numeric barcode.")

    try:
        async with httpx.AsyncClient(timeout=OFF_TIMEOUT) as client:
            resp = await client.get(
                f"{OFF_API}/{clean}.json",
                headers={"User-Agent": OFF_USER_AGENT},
            )
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Food database lookup timed out. Please check your internet connection and try again.")
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Network error connecting to food database: {str(e)}")

    if resp.status_code == 404:
        return NutriLensProduct(found=False, barcode=clean)

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Food database returned status {resp.status_code}.")

    data = resp.json()
    if not data or data.get("status") != 1 or not data.get("product"):
        return NutriLensProduct(found=False, barcode=clean)

    p = data["product"]
    n = p.get("nutriments", {})

    # Extract core nutrition per 100g
    cal = _num(n.get("energy-kcal_100g") or n.get("energy-kcal_value") or n.get("energy-kcal"))
    if not cal and n.get("energy_100g"):
        cal = round(_num(n["energy_100g"]) / 4.184)

    protein = round(_num(n.get("proteins_100g")), 1)
    carbs = round(_num(n.get("carbohydrates_100g")), 1)
    fat = round(_num(n.get("fat_100g")), 1)
    sugar = round(_num(n.get("sugars_100g")), 1)
    fiber = round(_num(n.get("fiber_100g")), 1)
    sat_fat = round(_num(n.get("saturated-fat_100g")), 1)

    # Sodium: OFF stores in grams, convert to mg
    sodium_mg = round(_num(n.get("sodium_100g")) * 1000)
    if not sodium_mg and n.get("salt_100g"):
        sodium_mg = round((_num(n["salt_100g"]) / 2.5) * 1000)

    # Allergens
    allergens = [
        a.replace("en:", "").replace("-", " ").title()
        for a in (p.get("allergens_tags") or [])
        if a
    ]

    # Categories
    categories = [
        c.replace("en:", "").replace("-", " ")
        for c in (p.get("categories_tags") or [])
        if c
    ]

    # Compute health score
    score = compute_health_score(cal, protein, fat, sugar, sodium_mg, fiber, sat_fat)
    verdict = get_health_verdict(score)

    return NutriLensProduct(
        found=True,
        barcode=clean,
        product_name=p.get("product_name") or p.get("product_name_en") or p.get("generic_name") or "Unknown Product",
        brand=p.get("brands") or p.get("brand_owner") or "Unknown Brand",
        image=p.get("image_front_url") or p.get("image_url") or p.get("image_small_url"),
        serving_size=p.get("serving_size") or "100g",
        calories=round(cal),
        protein=protein,
        carbohydrates=carbs,
        fat=fat,
        sugar=sugar,
        sodium=sodium_mg,
        fiber=fiber,
        saturated_fat=sat_fat,
        ingredients=p.get("ingredients_text") or p.get("ingredients_text_en") or "",
        allergens=allergens,
        categories=categories,
        nutriscore_grade=p.get("nutriscore_grade", "").upper() if p.get("nutriscore_grade") else None,
        health_score=score,
        health_verdict=verdict,
        calories_level=classify_level(cal, 100, 300),
        sugar_level=classify_level(sugar, 5, 12),
        fat_level=classify_level(fat, 3, 17),
        sodium_level=classify_level(sodium_mg, 140, 600),
        protein_level=classify_level(protein, 5, 15),
    )


@router.post("/verdict", response_model=VerdictResponse)
def get_ai_verdict(
    request: VerdictRequest,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Generate AI-powered nutrition verdict.
    Uses user profile data for personalized recommendations.
    """
    # Fetch user profile for personalization
    profile = db.query(models.Profile).filter(models.Profile.user_id == user.id).first()
    profile_data = None
    if profile:
        profile_data = {
            "age": profile.age,
            "weight_kg": profile.weight_kg,
            "height_cm": profile.height_cm,
            "activity_level": profile.activity_level,
            "goal": profile.goal,
            "diet_type": profile.diet_type,
            "allergies": profile.allergies,
            "foods_to_avoid": profile.foods_to_avoid,
        }

    ai_verdict, personalized, source = _generate_ai_verdict(request, profile_data)

    return VerdictResponse(
        ai_verdict=ai_verdict,
        personalized_recommendation=personalized,
        source=source,
    )


@router.get("/alternatives/{barcode}", response_model=AlternativesResponse)
async def get_alternatives(barcode: str, category: str = "", user=Depends(get_current_user)):
    """
    Find healthier alternative products in the same category.
    """
    if not category:
        return AlternativesResponse(alternatives=[])

    clean_cat = category.strip().lower().replace(" ", "-")

    try:
        async with httpx.AsyncClient(timeout=OFF_TIMEOUT) as client:
            resp = await client.get(
                f"{OFF_CATEGORY}/{clean_cat}.json?page_size=20",
                headers={"User-Agent": OFF_USER_AGENT},
            )
    except (httpx.TimeoutException, httpx.RequestError):
        return AlternativesResponse(alternatives=[])

    if resp.status_code != 200:
        return AlternativesResponse(alternatives=[])

    data = resp.json()
    products = data.get("products", [])
    if not isinstance(products, list):
        return AlternativesResponse(alternatives=[])

    alternatives = []
    for p in products:
        code = str(p.get("code", ""))
        if not code or code == barcode or not p.get("product_name"):
            continue

        n = p.get("nutriments", {})
        cal = round(_num(n.get("energy-kcal_100g")))
        prot = round(_num(n.get("proteins_100g")), 1)
        sug = round(_num(n.get("sugars_100g")), 1)
        f = round(_num(n.get("fat_100g")), 1)
        sod = round(_num(n.get("sodium_100g")) * 1000)
        fib = round(_num(n.get("fiber_100g")), 1)
        sf = round(_num(n.get("saturated-fat_100g")), 1)

        sc = compute_health_score(cal, prot, f, sug, sod, fib, sf)

        alternatives.append(NutriLensAlternative(
            barcode=code,
            product_name=p.get("product_name", "Alternative"),
            brand=p.get("brands", ""),
            image=p.get("image_front_url") or p.get("image_small_url"),
            calories=cal,
            protein=prot,
            sugar=sug,
            sodium=sod,
            health_score=sc,
        ))

    # Sort by health score descending, pick top 4
    alternatives.sort(key=lambda x: x.health_score, reverse=True)
    return AlternativesResponse(alternatives=alternatives[:4])
