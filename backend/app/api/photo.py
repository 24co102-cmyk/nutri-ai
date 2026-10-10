from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ..dependencies import get_current_user

router = APIRouter()

class PhotoRequest(BaseModel):
    # In a real app this would be an UploadFile, but for fallback we accept a URL string
    image_url: str

class PhotoResponse(BaseModel):
    detected_items: list
    disclaimer: str = "Nutrition values are estimates based on image analysis."

@router.post("/analyze", response_model=PhotoResponse)
def analyze_photo(request: PhotoRequest, user = Depends(get_current_user)):
    # Deterministic placeholder – return a static list
    dummy = [{"food_name": "Rice", "quantity": 1.0, "calories": 200}]
    return PhotoResponse(detected_items=dummy)
