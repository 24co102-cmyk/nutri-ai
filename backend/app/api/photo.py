# backend/app/api/photo.py
"""
NutriLens AI — Real Computer Vision Food Recognition
Utilizes Google Gemini Vision to recognize foods from photos,
matches recognized foods against the 233-item NutriEmotion Food Reference Starter Catalog,
retrieves verified nutrition benchmarks, supports multi-item plates, portion adjustments,
and provides transparent disclaimers for unverified foods.
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict, Tuple
from pathlib import Path
import base64
import json
import re

from ..dependencies import get_current_user, get_optional_current_user
from ..api.chat import get_gemini_client
from ..services.food_catalog import (
    match_food_in_catalog,
    calculate_nutrition_for_portion,
    get_catalog_item_by_id,
    get_all_catalog_items,
)

router = APIRouter()

# ── Schemas ───────────────────────────────────────────────────────────────────
class PhotoRequest(BaseModel):
    image_base64: Optional[str] = Field(None, description="Base64 encoded image data string")
    image_url: Optional[str] = Field(None, description="Data URL or image URL")

class DetectedFoodItem(BaseModel):
    name: str
    category: str = "Meal"
    serving: str = "100g serving"
    serving_grams: float = 100.0
    quantity: float = 1.0
    calories: float = 0.0
    protein_g: float = 0.0
    carbs_g: float = 0.0
    fat_g: float = 0.0
    fiber_g: float = 0.0
    sugar_g: float = 0.0
    sodium_mg: float = 0.0
    health_score: str = "B"
    emoji: str = "🍲"
    confidence: float = 90.0
    micronutrients: List[str] = []
    benefits: str = ""
    ai_tip: str = ""
    # Reference catalog fields
    matched_catalog: bool = False
    catalog_id: Optional[str] = None
    catalog_name: Optional[str] = None
    reference_source: str = "AI Vision Estimate (Unverified)"
    is_approximate: bool = True
    notes: Optional[str] = None
    image_file: Optional[str] = None
    image_url: Optional[str] = None
    nutrition_per_100g: Optional[Dict[str, float]] = None

class PlateSummary(BaseModel):
    total_calories: float = 0.0
    total_protein_g: float = 0.0
    total_carbs_g: float = 0.0
    total_fat_g: float = 0.0
    total_fiber_g: float = 0.0
    total_sugar_g: float = 0.0
    total_sodium_mg: float = 0.0
    item_count: int = 0
    matched_count: int = 0
    unmatched_count: int = 0

class PhotoResponse(BaseModel):
    success: bool = True
    is_food: bool = True
    detected_items: List[DetectedFoodItem] = []
    plate_summary: Optional[PlateSummary] = None
    message: Optional[str] = None
    disclaimer: str = (
        "Nutrition values are estimates based on computer vision recognition and the NutriEmotion "
        "Reference Starter Catalog. Portion sizes and preparation methods can significantly alter actual values."
    )

class PortionAdjustmentItem(BaseModel):
    name: str
    catalog_id: Optional[str] = None
    serving_grams: float = 100.0
    quantity: float = 1.0
    category: Optional[str] = "Meal"
    baseline_per_100g: Optional[Dict[str, float]] = None
    emoji: Optional[str] = "🍲"
    health_score: Optional[str] = "B"
    micronutrients: Optional[List[str]] = []
    benefits: Optional[str] = ""
    ai_tip: Optional[str] = ""

class RecalculateRequest(BaseModel):
    items: List[PortionAdjustmentItem]


VISION_PROMPT = """You are an expert clinical nutritionist and computer vision food recognition model.
Carefully inspect the provided image.

Instructions:
1. First evaluate if the image shows edible food, meals, produce, groceries, or beverages.
   If the image DOES NOT show food (e.g. an empty room, a document, random objects, people, pets, or completely unidentifiable blurs), output:
   {"is_food": false, "message": "No food detected in this photograph."}

2. If the image DOES contain food:
   Identify ALL distinct food items or dishes visible on the plate or in the photo (e.g. if a plate has rice, chicken curry, and salad, output all 3 items).
   For each item, output:
   - "name": Clean, specific food/dish title (e.g., "Chicken Biryani", "Steamed Broccoli", "Apple", "Dal Tadka", "White Rice", "Grilled Salmon").
   - "category": Matching category from: ["Vegetables", "Fruits", "Chicken Dishes", "Mutton Dishes", "Fish Dishes", "Beef Dishes", "Egg Dishes", "Grains", "Legumes", "Dairy", "International", "Snacks", "Beverages", "Dessert", "Other"].
   - "serving": Realistic portion description (e.g., "150g serving", "1 medium bowl", "100g").
   - "serving_grams": Numerical estimated grams (e.g., 100.0, 150.0, 200.0). Default to 100.0 if uncertain.
   - "quantity": Number of servings (default 1.0).
   - "calories": Estimated kcal for this serving (e.g., 240).
   - "protein_g": Protein in grams (e.g., 18.5).
   - "carbs_g": Carbohydrates in grams (e.g., 25.0).
   - "fat_g": Fat in grams (e.g., 8.0).
   - "fiber_g": Dietary fiber in grams (e.g., 3.2).
   - "sugar_g": Sugar in grams (e.g., 2.5).
   - "sodium_mg": Sodium in milligrams (e.g., 380).
   - "health_score": Grade based on nutrient density: one of ["A+", "A", "B+", "B", "C+", "C", "D"].
   - "emoji": Appropriate single food emoji matching the dish.
   - "confidence": Estimated recognition confidence percentage (e.g., 94.0).
   - "micronutrients": Array of 2 to 4 prominent vitamins or minerals (e.g., ["Vitamin C", "Potassium", "Iron"]).
   - "benefits": 1-2 sentence evidence-based nutritional health benefit.
   - "ai_tip": 1 actionable recommendation or healthy pairing.

Return ONLY a raw JSON object with NO Markdown wrappers, NO commentary:
{
  "is_food": true,
  "items": [
    {
      "name": "...",
      "category": "...",
      "serving": "...",
      "serving_grams": 100.0,
      "quantity": 1.0,
      "calories": 0.0,
      "protein_g": 0.0,
      "carbs_g": 0.0,
      "fat_g": 0.0,
      "fiber_g": 0.0,
      "sugar_g": 0.0,
      "sodium_mg": 0.0,
      "health_score": "A",
      "emoji": "🍲",
      "confidence": 95.0,
      "micronutrients": ["Vitamin C"],
      "benefits": "...",
      "ai_tip": "..."
    }
  ]
}"""


def _extract_image_bytes_and_mime(request: PhotoRequest) -> Tuple[bytes, str]:
    raw_str = request.image_base64 or request.image_url
    if not raw_str:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No image data provided. Please provide an image_base64 or image_url.",
        )

    mime_type = "image/jpeg"
    b64_content = raw_str

    if "base64," in raw_str:
        header, b64_content = raw_str.split("base64,", 1)
        match = re.search(r"data:([^;]+);", header)
        if match:
            mime_type = match.group(1).strip()
    elif raw_str.startswith("http://") or raw_str.startswith("https://"):
        import urllib.request
        try:
            req = urllib.request.Request(raw_str, headers={"User-Agent": "NutriLens/1.0"})
            with urllib.request.urlopen(req, timeout=10) as response:
                content = response.read()
                content_type = response.headers.get_content_type()
                return content, content_type or "image/jpeg"
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to fetch image from URL: {str(e)}",
            )

    try:
        image_bytes = base64.b64decode(b64_content)
        if len(image_bytes) < 8:
            raise ValueError("Decoded image data is too small to be a valid photo.")
        return image_bytes, mime_type
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid base64 image data: {str(e)}",
        )


def _call_gemini_vision(image_bytes: bytes, mime_type: str) -> Optional[Dict[str, Any]]:
    client = get_gemini_client()
    if not client:
        return None

    try:
        from google.genai import types
        part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
    except Exception as e:
        print(f"[Vision Part Error]: {e}")
        return None

    # Verified vision models; gemini-3.8-flash first
    models_to_try = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite"]
    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=[part, VISION_PROMPT],
            )
            if response and response.text:
                cleaned = response.text.strip()
                if cleaned.startswith("```"):
                    cleaned = re.sub(r"^```[a-zA-Z]*\n?", "", cleaned)
                    cleaned = re.sub(r"\n?```$", "", cleaned)
                parsed = json.loads(cleaned)
                return parsed
        except Exception as e:
            print(f"[Gemini Vision Model {model_name} failed]: {e}")
            continue

    return None


def _parse_grams_from_text(serving_text: str, default_grams: float = 100.0) -> float:
    """Extract numeric gram value from serving string like '150g' or '1 bowl (200g)'."""
    if not serving_text:
        return default_grams
    match = re.search(r"(\d+(?:\.\d+)?)\s*g\b", serving_text, re.IGNORECASE)
    if match:
        try:
            val = float(match.group(1))
            if 5.0 <= val <= 2000.0:
                return val
        except Exception:
            pass
    return default_grams


def _process_detected_items(raw_items: List[Dict[str, Any]]) -> Tuple[List[DetectedFoodItem], PlateSummary]:
    """
    Enrich vision recognized food items with reference catalog benchmarks when available.
    If an item is not in the catalog, clearly mark it as unverified AI estimate.
    """
    detected: List[DetectedFoodItem] = []
    matched_count = 0
    unmatched_count = 0

    for it in raw_items:
        raw_name = str(it.get("name") or "Food Item").strip()
        if not raw_name:
            continue

        qty = max(0.1, float(it.get("quantity") or 1.0))
        raw_serving_grams = it.get("serving_grams")
        if raw_serving_grams is not None:
            try:
                serving_grams = float(raw_serving_grams)
            except Exception:
                serving_grams = 100.0
        else:
            serving_grams = _parse_grams_from_text(str(it.get("serving") or ""), 100.0)

        # Attempt to match against starter reference catalog
        cat_match = match_food_in_catalog(raw_name)

        if cat_match:
            matched_count += 1
            cat_id = str(cat_match.get("id") or "")
            cat_name = str(cat_match.get("name") or raw_name)
            cat_category = str(cat_match.get("category") or it.get("category") or "Meal")
            image_file = cat_match.get("image_file", "")
            filename = Path(image_file).name if image_file else ""
            image_url = f"/food_reference_images/{filename}" if filename else None
            notes = cat_match.get("notes") or "Generic reference estimate from starter catalog."
            nutr_100 = cat_match.get("nutrition_per_100g", {})

            # Scale nutrition accurately by grams and quantity
            factor = (serving_grams / 100.0) * qty
            cal = round(float(nutr_100.get("calories_kcal", 0.0)) * factor, 1)
            prot = round(float(nutr_100.get("protein_g", 0.0)) * factor, 1)
            carbs = round(float(nutr_100.get("carbohydrates_g", 0.0)) * factor, 1)
            fat = round(float(nutr_100.get("fat_g", 0.0)) * factor, 1)
            fiber = round(float(nutr_100.get("fiber_g", 0.0)) * factor, 1)
            sugar = round(float(nutr_100.get("sugar_g", 0.0)) * factor, 1)
            sodium = round(float(nutr_100.get("sodium_mg", 0.0)) * factor, 1)

            item = DetectedFoodItem(
                name=cat_name,
                category=cat_category,
                serving=f"{round(serving_grams * qty, 1)}g",
                serving_grams=round(serving_grams, 1),
                quantity=qty,
                calories=cal,
                protein_g=prot,
                carbs_g=carbs,
                fat_g=fat,
                fiber_g=fiber,
                sugar_g=sugar,
                sodium_mg=sodium,
                health_score=str(it.get("health_score") or "A"),
                emoji=str(it.get("emoji") or "🥗"),
                confidence=float(it.get("confidence") or 92.0),
                micronutrients=it.get("micronutrients") or ["Vitamins", "Minerals"],
                benefits=str(it.get("benefits") or f"{cat_name} provides essential macro and micronutrients."),
                ai_tip=str(it.get("ai_tip") or "Balanced portion from reference catalog."),
                matched_catalog=True,
                catalog_id=cat_id,
                catalog_name=cat_name,
                reference_source="NutriEmotion Food Reference Starter Catalog",
                is_approximate=cat_match.get("nutrition_is_approximate", True),
                notes=notes,
                image_file=image_file,
                image_url=image_url,
                nutrition_per_100g={
                    "calories_kcal": float(nutr_100.get("calories_kcal", 0.0)),
                    "protein_g": float(nutr_100.get("protein_g", 0.0)),
                    "carbohydrates_g": float(nutr_100.get("carbohydrates_g", 0.0)),
                    "fat_g": float(nutr_100.get("fat_g", 0.0)),
                    "fiber_g": float(nutr_100.get("fiber_g", 0.0)),
                    "sugar_g": float(nutr_100.get("sugar_g", 0.0)),
                    "sodium_mg": float(nutr_100.get("sodium_mg", 0.0)),
                },
            )
            detected.append(item)
        else:
            # Food item not in starter catalog — use AI vision estimates with explicit disclaimers
            unmatched_count += 1
            cal = round(float(it.get("calories") or 0.0) * qty, 1)
            prot = round(float(it.get("protein_g") or 0.0) * qty, 1)
            carbs = round(float(it.get("carbs_g") or 0.0) * qty, 1)
            fat = round(float(it.get("fat_g") or 0.0) * qty, 1)
            fiber = round(float(it.get("fiber_g") or 0.0) * qty, 1)
            sugar = round(float(it.get("sugar_g") or 0.0) * qty, 1)
            sodium = round(float(it.get("sodium_mg") or 0.0) * qty, 1)

            # Compute approximate per-100g baseline for portion scaling
            effective_total_g = max(10.0, serving_grams * qty)
            ratio_100 = 100.0 / effective_total_g

            item = DetectedFoodItem(
                name=raw_name,
                category=str(it.get("category") or "Meal"),
                serving=f"{round(serving_grams * qty, 1)}g",
                serving_grams=round(serving_grams, 1),
                quantity=qty,
                calories=cal,
                protein_g=prot,
                carbs_g=carbs,
                fat_g=fat,
                fiber_g=fiber,
                sugar_g=sugar,
                sodium_mg=sodium,
                health_score=str(it.get("health_score") or "B"),
                emoji=str(it.get("emoji") or "🍲"),
                confidence=float(it.get("confidence") or 85.0),
                micronutrients=it.get("micronutrients") or ["General nutrients"],
                benefits=str(it.get("benefits") or "Nutrient estimation generated by computer vision."),
                ai_tip=str(it.get("ai_tip") or "Unverified item: check portion size before logging."),
                matched_catalog=False,
                catalog_id=None,
                catalog_name=None,
                reference_source="AI Vision Estimate (Unverified - Not in Starter Catalog)",
                is_approximate=True,
                notes="Not found in reference catalog; values are AI estimates and not laboratory verified.",
                image_file=None,
                image_url=None,
                nutrition_per_100g={
                    "calories_kcal": round(cal * ratio_100, 1),
                    "protein_g": round(prot * ratio_100, 1),
                    "carbohydrates_g": round(carbs * ratio_100, 1),
                    "fat_g": round(fat * ratio_100, 1),
                    "fiber_g": round(fiber * ratio_100, 1),
                    "sugar_g": round(sugar * ratio_100, 1),
                    "sodium_mg": round(sodium * ratio_100, 1),
                },
            )
            detected.append(item)

    # Compute plate summary
    summary = PlateSummary(
        total_calories=round(sum(it.calories for it in detected), 1),
        total_protein_g=round(sum(it.protein_g for it in detected), 1),
        total_carbs_g=round(sum(it.carbs_g for it in detected), 1),
        total_fat_g=round(sum(it.fat_g for it in detected), 1),
        total_fiber_g=round(sum(it.fiber_g for it in detected), 1),
        total_sugar_g=round(sum(it.sugar_g for it in detected), 1),
        total_sodium_mg=round(sum(it.sodium_mg for it in detected), 1),
        item_count=len(detected),
        matched_count=matched_count,
        unmatched_count=unmatched_count,
    )

    return detected, summary


@router.post("/analyze", response_model=PhotoResponse)
def analyze_photo(
    request: PhotoRequest,
    user=Depends(get_current_user),
):
    image_bytes, mime_type = _extract_image_bytes_and_mime(request)
    vision_result = _call_gemini_vision(image_bytes, mime_type)

    if not vision_result:
        return PhotoResponse(
            success=False,
            is_food=False,
            detected_items=[],
            plate_summary=None,
            message="AI computer vision service could not analyze this image. Please check your connection or choose foods manually from the reference database.",
        )

    if not vision_result.get("is_food", True):
        msg = vision_result.get("message") or "No food recognized in this photo. Please photograph a meal or snack."
        return PhotoResponse(
            success=True,
            is_food=False,
            detected_items=[],
            plate_summary=None,
            message=msg,
        )

    raw_items = vision_result.get("items", [])
    if not raw_items:
        return PhotoResponse(
            success=True,
            is_food=False,
            detected_items=[],
            plate_summary=None,
            message="No distinct food items could be identified in this photo.",
        )

    detected, plate_summary = _process_detected_items(raw_items)

    if not detected:
        return PhotoResponse(
            success=True,
            is_food=False,
            detected_items=[],
            plate_summary=None,
            message="Unable to compute nutrition profile for items in this photo.",
        )

    if plate_summary.matched_count == len(detected):
        msg = f"Identified {len(detected)} item(s) — all matched with verified reference catalog benchmarks."
    elif plate_summary.matched_count > 0:
        msg = f"Identified {len(detected)} item(s) ({plate_summary.matched_count} verified from catalog, {plate_summary.unmatched_count} AI estimated)."
    else:
        msg = f"Identified {len(detected)} item(s) via AI vision estimation (not found in starter catalog)."

    return PhotoResponse(
        success=True,
        is_food=True,
        detected_items=detected,
        plate_summary=plate_summary,
        message=msg,
    )


@router.post("/upload", response_model=PhotoResponse)
async def upload_photo(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image (JPEG, PNG, WEBP).")

    content = await file.read()
    if len(content) < 8:
        raise HTTPException(status_code=400, detail="Uploaded image file is empty or corrupted.")

    vision_result = _call_gemini_vision(content, file.content_type)
    if not vision_result:
        return PhotoResponse(
            success=False,
            is_food=False,
            detected_items=[],
            plate_summary=None,
            message="AI computer vision service could not analyze this image. Please select food manually.",
        )

    if not vision_result.get("is_food", True):
        return PhotoResponse(
            success=True,
            is_food=False,
            detected_items=[],
            plate_summary=None,
            message=vision_result.get("message") or "No food recognized in uploaded image.",
        )

    raw_items = vision_result.get("items", [])
    if not raw_items:
        return PhotoResponse(
            success=True,
            is_food=False,
            detected_items=[],
            plate_summary=None,
            message="No food items detected in image.",
        )

    detected, plate_summary = _process_detected_items(raw_items)

    if plate_summary.matched_count == len(detected):
        msg = f"Identified {len(detected)} item(s) — all matched with verified reference catalog benchmarks."
    elif plate_summary.matched_count > 0:
        msg = f"Identified {len(detected)} item(s) ({plate_summary.matched_count} verified from catalog, {plate_summary.unmatched_count} AI estimated)."
    else:
        msg = f"Identified {len(detected)} item(s) via AI vision estimation (not found in starter catalog)."

    return PhotoResponse(
        success=True,
        is_food=len(detected) > 0,
        detected_items=detected,
        plate_summary=plate_summary,
        message=msg,
    )


@router.post("/recalculate", response_model=PhotoResponse)
def recalculate_plate(
    req: RecalculateRequest,
    user=Depends(get_current_user),
):
    """
    Recalculate nutrition and plate totals when user adjusts portion weight (grams) or quantity.
    """
    detected: List[DetectedFoodItem] = []
    matched_count = 0
    unmatched_count = 0

    for it in req.items:
        grams = max(1.0, float(it.serving_grams or 100.0))
        qty = max(0.1, float(it.quantity or 1.0))
        effective_grams = grams * qty

        cat_item = None
        if it.catalog_id:
            cat_item = get_catalog_item_by_id(it.catalog_id)
        if not cat_item:
            cat_item = match_food_in_catalog(it.name)

        if cat_item:
            matched_count += 1
            nutr = calculate_nutrition_for_portion(cat_item, grams=grams, quantity_multiplier=qty)
            item = DetectedFoodItem(
                name=str(cat_item.get("name") or it.name),
                category=str(cat_item.get("category") or it.category or "Meal"),
                serving=f"{round(effective_grams, 1)}g",
                serving_grams=round(grams, 1),
                quantity=qty,
                calories=nutr["calories"],
                protein_g=nutr["protein_g"],
                carbs_g=nutr["carbs_g"],
                fat_g=nutr["fat_g"],
                fiber_g=nutr["fiber_g"],
                sugar_g=nutr["sugar_g"],
                sodium_mg=nutr["sodium_mg"],
                health_score=it.health_score or "A",
                emoji=it.emoji or "🥗",
                confidence=95.0,
                micronutrients=it.micronutrients or ["Vitamins", "Minerals"],
                benefits=it.benefits or f"{cat_item.get('name')} provides balanced reference nutrition.",
                ai_tip=it.ai_tip or "Portion updated from catalog benchmark.",
                matched_catalog=True,
                catalog_id=cat_item.get("id"),
                catalog_name=cat_item.get("name"),
                reference_source="NutriEmotion Food Reference Starter Catalog",
                is_approximate=cat_item.get("nutrition_is_approximate", True),
                notes=cat_item.get("notes"),
                image_file=cat_item.get("image_file"),
                image_url=nutr.get("image_url"),
                nutrition_per_100g=cat_item.get("nutrition_per_100g"),
            )
            detected.append(item)
        else:
            unmatched_count += 1
            base = it.baseline_per_100g or {}
            factor = effective_grams / 100.0
            cal = round(float(base.get("calories_kcal", 0.0)) * factor, 1)
            prot = round(float(base.get("protein_g", 0.0)) * factor, 1)
            carbs = round(float(base.get("carbohydrates_g", 0.0)) * factor, 1)
            fat = round(float(base.get("fat_g", 0.0)) * factor, 1)
            fiber = round(float(base.get("fiber_g", 0.0)) * factor, 1)
            sugar = round(float(base.get("sugar_g", 0.0)) * factor, 1)
            sodium = round(float(base.get("sodium_mg", 0.0)) * factor, 1)

            item = DetectedFoodItem(
                name=it.name,
                category=it.category or "Meal",
                serving=f"{round(effective_grams, 1)}g",
                serving_grams=round(grams, 1),
                quantity=qty,
                calories=cal,
                protein_g=prot,
                carbs_g=carbs,
                fat_g=fat,
                fiber_g=fiber,
                sugar_g=sugar,
                sodium_mg=sodium,
                health_score=it.health_score or "B",
                emoji=it.emoji or "🍲",
                confidence=85.0,
                micronutrients=it.micronutrients or ["General nutrients"],
                benefits=it.benefits or "Nutrient estimation based on adjusted portion.",
                ai_tip=it.ai_tip or "Unverified item: check portion size before logging.",
                matched_catalog=False,
                catalog_id=None,
                catalog_name=None,
                reference_source="AI Vision Estimate (Unverified - Not in Starter Catalog)",
                is_approximate=True,
                notes="Not in reference catalog; values are scaled estimates.",
                image_file=None,
                image_url=None,
                nutrition_per_100g=base,
            )
            detected.append(item)

    plate_summary = PlateSummary(
        total_calories=round(sum(it.calories for it in detected), 1),
        total_protein_g=round(sum(it.protein_g for it in detected), 1),
        total_carbs_g=round(sum(it.carbs_g for it in detected), 1),
        total_fat_g=round(sum(it.fat_g for it in detected), 1),
        total_fiber_g=round(sum(it.fiber_g for it in detected), 1),
        total_sugar_g=round(sum(it.sugar_g for it in detected), 1),
        total_sodium_mg=round(sum(it.sodium_mg for it in detected), 1),
        item_count=len(detected),
        matched_count=matched_count,
        unmatched_count=unmatched_count,
    )

    return PhotoResponse(
        success=True,
        is_food=True,
        detected_items=detected,
        plate_summary=plate_summary,
        message=f"Recalculated nutrition for {len(detected)} item(s) on plate.",
    )


# ── Food Basket Gallery & Download ───────────────────────────────────────────
BASKET_CATEGORY_ORDER = [
    "All Foods",
    "Fruits",
    "Vegetables",
    "Indian Dishes",
    "International Dishes",
    "Protein Foods",
    "Grains",
    "Dairy",
    "Snacks",
    "Desserts",
    "Drinks",
]


def map_to_basket_category(raw_cat: str) -> str:
    c = (raw_cat or "").lower().strip()
    if "fruit" in c:
        return "Fruits"
    if "vegetable" in c:
        return "Vegetables"
    if "indian" in c or "legume dish" in c or "chana" in c or "rajma" in c or "roti" in c:
        return "Indian Dishes"
    if any(k in c for k in ["international", "japanese", "thai", "mexican", "asian", "middle eastern", "salad", "soup", "sandwich", "side dish", "breakfast"]):
        return "International Dishes"
    if any(k in c for k in ["protein", "seafood", "legume", "grilled dish", "chicken", "fish", "meat", "egg"]):
        return "Protein Foods"
    if any(k in c for k in ["grain", "bread", "bakery", "pasta", "oats", "rice"]):
        return "Grains"
    if any(k in c for k in ["dairy"]):
        return "Dairy"
    if any(k in c for k in ["snack", "nuts and seeds", "spread", "oil", "fat"]):
        return "Snacks"
    if any(k in c for k in ["dessert", "sweetener"]):
        return "Desserts"
    if any(k in c for k in ["drink"]):
        return "Drinks"
    return "International Dishes"


@router.get("/basket")
def get_food_basket(
    category: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    user=Depends(get_optional_current_user),
):
    """
    Searchable Food Basket gallery:
    Lists all 233 reference items with mapped categories, verified nutrition,
    genuine high-resolution photo availability, and exact category counts.
    """
    items = get_all_catalog_items()
    photo_dir = Path(__file__).resolve().parent.parent / "data" / "food_photos"

    category_counts: Dict[str, int] = {cat: 0 for cat in BASKET_CATEGORY_ORDER}
    category_counts["All Foods"] = len(items)

    search_q = q.strip().lower() if q else None
    basket_items = []
    total_photos = 0

    for item in items:
        raw_cat = item.get("category", "")
        basket_cat = map_to_basket_category(raw_cat)
        category_counts[basket_cat] = category_counts.get(basket_cat, 0) + 1

        image_file = item.get("image_file", "")
        stem = Path(image_file).stem if image_file else ""
        svg_filename = f"{stem}.svg" if stem else ""
        jpg_filename = f"{stem}.jpg" if stem else ""

        has_photo = False
        if photo_dir.exists() and (photo_dir / jpg_filename).exists() and (photo_dir / jpg_filename).stat().st_size > 5000:
            has_photo = True
            total_photos += 1

        # Filtering
        if category and category != "All Foods" and basket_cat != category:
            continue
        if search_q:
            aliases_text = " ".join(item.get("aliases", [])).lower()
            name_text = item.get("name", "").lower()
            if search_q not in name_text and search_q not in aliases_text and search_q not in raw_cat.lower():
                continue

        nutr = item.get("nutrition_per_100g", {})
        basket_items.append({
            "id": item.get("id"),
            "name": item.get("name"),
            "category": raw_cat,
            "basket_category": basket_cat,
            "typical_serving": item.get("typical_serving", "100 g"),
            "serving_grams": 100.0,
            "calories": float(nutr.get("calories_kcal", 0.0)),
            "protein_g": float(nutr.get("protein_g", 0.0)),
            "carbs_g": float(nutr.get("carbohydrates_g", 0.0)),
            "fat_g": float(nutr.get("fat_g", 0.0)),
            "fiber_g": float(nutr.get("fiber_g", 0.0)),
            "sugar_g": float(nutr.get("sugar_g", 0.0)),
            "sodium_mg": float(nutr.get("sodium_mg", 0.0)),
            "notes": item.get("notes", ""),
            "image_file": image_file,
            "svg_url": f"/food_reference_images/{svg_filename}" if svg_filename else None,
            "photo_url": f"/food_photos/{jpg_filename}" if has_photo else None,
            "has_photo": has_photo,
            "image_type": "photograph" if has_photo else "reference_illustration",
            "download_filename": jpg_filename if has_photo else svg_filename,
            "is_approximate": item.get("nutrition_is_approximate", True),
            "reference_source": "NutriEmotion Food Reference Starter Catalog",
        })

    categories_list = [
        {"name": cat, "count": category_counts.get(cat, 0)}
        for cat in BASKET_CATEGORY_ORDER
    ]

    return {
        "success": True,
        "total_items": len(items),
        "total_photos": total_photos,
        "displayed_items": len(basket_items),
        "categories": categories_list,
        "items": basket_items,
    }


@router.get("/basket/download")
def download_food_image(
    item_id: Optional[str] = Query(None, description="Catalog Food ID e.g. food_0001 or food name"),
    filename: Optional[str] = Query(None, description="Direct filename e.g. apple.jpg or apple.svg"),
    preferred: Optional[str] = Query("photo", description="Preferred image format: 'photo' or 'svg'"),
    user=Depends(get_optional_current_user),
):
    """
    Safely download genuine food photographs or verified reference SVG cards.
    Streams actual local file with attachment headers.
    """
    base_dir = Path(__file__).resolve().parent.parent / "data"
    photo_dir = base_dir / "food_photos"
    svg_dir = base_dir / "food_reference" / "images"

    target_file: Optional[Path] = None
    download_name: str = "food_image"

    # 1. Direct filename request
    if filename:
        clean_name = Path(filename).name
        if not re.match(r"^[a-zA-Z0-9_\-\.]+\.(jpg|jpeg|png|webp|svg)$", clean_name, re.IGNORECASE):
            raise HTTPException(status_code=400, detail="Invalid filename format requested.")

        if (photo_dir / clean_name).exists():
            target_file = photo_dir / clean_name
            download_name = clean_name
        elif (svg_dir / clean_name).exists():
            target_file = svg_dir / clean_name
            download_name = clean_name

    # 2. Lookup by item_id or food name
    elif item_id:
        item = get_catalog_item_by_id(item_id)
        if not item:
            item = match_food_in_catalog(item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Food item not found in catalog.")

        stem = Path(item.get("image_file", "")).stem
        if not stem:
            raise HTTPException(status_code=404, detail="No registered image file for this food.")

        jpg_candidate = photo_dir / f"{stem}.jpg"
        svg_candidate = svg_dir / f"{stem}.svg"

        if preferred == "svg" and svg_candidate.exists():
            target_file = svg_candidate
            download_name = f"{stem}.svg"
        elif jpg_candidate.exists() and jpg_candidate.stat().st_size > 5000:
            target_file = jpg_candidate
            download_name = f"{stem}.jpg"
        elif svg_candidate.exists():
            target_file = svg_candidate
            download_name = f"{stem}.svg"

    if not target_file or not target_file.exists():
        raise HTTPException(
            status_code=404,
            detail="The requested food image file is not locally available on the server.",
        )

    mime = "image/jpeg" if target_file.suffix.lower() in [".jpg", ".jpeg"] else "image/svg+xml"
    if target_file.suffix.lower() == ".png":
        mime = "image/png"
    elif target_file.suffix.lower() == ".webp":
        mime = "image/webp"

    return FileResponse(
        path=str(target_file),
        media_type=mime,
        filename=download_name,
        headers={
            "Content-Disposition": f'attachment; filename="{download_name}"',
            "Access-Control-Expose-Headers": "Content-Disposition",
        },
    )

