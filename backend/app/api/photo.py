# backend/app/api/photo.py
"""
NutriLens AI — Real Computer Vision Food Recognition
Utilizes Google Gemini Vision to recognize foods from photos, compute macronutrients,
estimate portions, and return authentic nutritional breakdowns.
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
import base64
import json
import re
import io

from ..dependencies import get_current_user
from ..api.chat import get_gemini_client, GEMINI_MODELS

router = APIRouter()

# ── Schemas ───────────────────────────────────────────────────────────────────
class PhotoRequest(BaseModel):
    image_base64: Optional[str] = Field(None, description="Base64 encoded image data string")
    image_url: Optional[str] = Field(None, description="Data URL or image URL")

class DetectedFoodItem(BaseModel):
    name: str
    category: str = "Meal"
    serving: str = "1 serving"
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

class PhotoResponse(BaseModel):
    success: bool = True
    is_food: bool = True
    detected_items: List[DetectedFoodItem] = []
    message: Optional[str] = None
    disclaimer: str = "Nutrition values are estimates based on computer vision analysis. Confirm values before logging."


VISION_PROMPT = """You are an expert clinical nutritionist and computer vision food recognition model.
Carefully inspect the provided image.

Instructions:
1. First evaluate if the image shows edible food, meals, produce, groceries, or beverages.
   If the image DOES NOT show food (e.g. an empty room, a document, random objects, people, pets, or completely unidentifiable blurs), output:
   {"is_food": false, "message": "No food detected in this photograph."}

2. If the image DOES contain food:
   Identify the primary dish or foods visible. Provide accurate nutritional estimates for a typical adult serving portion.
   For each item, output:
   - "name": Clean, specific dish or food title (e.g., "Chicken Biryani", "Steamed Broccoli", "Apple Slices", "Greek Salad", "Grilled Salmon").
   - "category": Best matching category from: ["Vegetables", "Fruits", "Chicken Dishes", "Mutton Dishes", "Fish Dishes", "Beef Dishes", "Egg Dishes", "Grains", "Legumes", "Dairy", "International", "Snacks", "Beverages", "Dessert", "Other"].
   - "serving": Realistic portion description (e.g., "150g serving", "1 medium bowl", "1 plate (250g)").
   - "quantity": Number of servings (default 1.0).
   - "calories": Number of kcal (e.g., 240).
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


def _extract_image_bytes_and_mime(request: PhotoRequest) -> tuple[bytes, str]:
    raw_str = request.image_base64 or request.image_url
    if not raw_str:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No image data provided. Please provide an image_base64 or image_url.",
        )

    mime_type = "image/jpeg"
    b64_content = raw_str

    # Handle data:image/png;base64,... headers
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

    # Try verified vision-capable models
    models_to_try = ["gemini-3.1-flash-lite", "gemini-3.5-flash", "gemini-3.8-flash"]
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
            message="AI computer vision service could not analyze this image. Please check your connection or choose foods manually from the database.",
        )

    if not vision_result.get("is_food", True):
        msg = vision_result.get("message") or "No food recognized in this photo. Please photograph a meal or snack."
        return PhotoResponse(
            success=True,
            is_food=False,
            detected_items=[],
            message=msg,
        )

    raw_items = vision_result.get("items", [])
    if not raw_items:
        return PhotoResponse(
            success=True,
            is_food=False,
            detected_items=[],
            message="No distinct food items could be identified in this photo.",
        )

    detected: List[DetectedFoodItem] = []
    for it in raw_items:
        try:
            item = DetectedFoodItem(
                name=it.get("name") or "Recognized Food",
                category=it.get("category") or "Meal",
                serving=it.get("serving") or "1 serving",
                quantity=float(it.get("quantity") or 1.0),
                calories=float(it.get("calories") or 0.0),
                protein_g=float(it.get("protein_g") or 0.0),
                carbs_g=float(it.get("carbs_g") or 0.0),
                fat_g=float(it.get("fat_g") or 0.0),
                fiber_g=float(it.get("fiber_g") or 0.0),
                sugar_g=float(it.get("sugar_g") or 0.0),
                sodium_mg=float(it.get("sodium_mg") or 0.0),
                health_score=str(it.get("health_score") or "B"),
                emoji=str(it.get("emoji") or "🍲"),
                confidence=float(it.get("confidence") or 90.0),
                micronutrients=it.get("micronutrients") or [],
                benefits=str(it.get("benefits") or ""),
                ai_tip=str(it.get("ai_tip") or ""),
            )
            detected.append(item)
        except Exception as parse_err:
            print(f"[Item Parse Error]: {parse_err}")
            continue

    if not detected:
        return PhotoResponse(
            success=True,
            is_food=False,
            detected_items=[],
            message="Unable to compute nutrition profile for items in this photo.",
        )

    return PhotoResponse(
        success=True,
        is_food=True,
        detected_items=detected,
        message=f"Successfully identified {detected[0].name} with complete nutritional breakdown.",
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
            message="AI computer vision service could not analyze this image. Please select food manually.",
        )

    if not vision_result.get("is_food", True):
        return PhotoResponse(
            success=True,
            is_food=False,
            detected_items=[],
            message=vision_result.get("message") or "No food recognized in uploaded image.",
        )

    raw_items = vision_result.get("items", [])
    detected: List[DetectedFoodItem] = []
    for it in raw_items:
        try:
            detected.append(
                DetectedFoodItem(
                    name=it.get("name") or "Recognized Food",
                    category=it.get("category") or "Meal",
                    serving=it.get("serving") or "1 serving",
                    quantity=float(it.get("quantity") or 1.0),
                    calories=float(it.get("calories") or 0.0),
                    protein_g=float(it.get("protein_g") or 0.0),
                    carbs_g=float(it.get("carbs_g") or 0.0),
                    fat_g=float(it.get("fat_g") or 0.0),
                    fiber_g=float(it.get("fiber_g") or 0.0),
                    sugar_g=float(it.get("sugar_g") or 0.0),
                    sodium_mg=float(it.get("sodium_mg") or 0.0),
                    health_score=str(it.get("health_score") or "B"),
                    emoji=str(it.get("emoji") or "🍲"),
                    confidence=float(it.get("confidence") or 90.0),
                    micronutrients=it.get("micronutrients") or [],
                    benefits=str(it.get("benefits") or ""),
                    ai_tip=str(it.get("ai_tip") or ""),
                )
            )
        except Exception:
            continue

    return PhotoResponse(
        success=True,
        is_food=len(detected) > 0,
        detected_items=detected,
        message=f"Identified {len(detected)} item(s) from image." if detected else "No food items detected.",
    )
