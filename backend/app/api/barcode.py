import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import ManagedProduct
from ..schemas import ManagedProductCreate, ManagedProductUpdate, ManagedProductOut

router = APIRouter()

def serialize_product(p: ManagedProduct) -> dict:
    try:
        ingredients_list = json.loads(p.ingredients) if p.ingredients else []
        if not isinstance(ingredients_list, list):
            ingredients_list = [str(p.ingredients)]
    except Exception:
        ingredients_list = [i.strip() for i in p.ingredients.split(",") if i.strip()] if p.ingredients else []

    try:
        allergens_list = json.loads(p.allergens) if p.allergens else []
        if not isinstance(allergens_list, list):
            allergens_list = [str(p.allergens)]
    except Exception:
        allergens_list = [a.strip() for a in p.allergens.split(",") if a.strip()] if p.allergens else []

    return {
        "serialNumber": p.serial_number,
        "barcode": p.barcode,
        "productName": p.product_name,
        "brandName": p.brand_name or "",
        "category": p.category or "",
        "servingSize": p.serving_size or "",
        "calories": float(p.calories or 0),
        "protein": float(p.protein or 0),
        "carbohydrates": float(p.carbohydrates or 0),
        "fat": float(p.fat or 0),
        "sugar": float(p.sugar or 0),
        "fiber": float(p.fiber or 0),
        "sodium": float(p.sodium or 0),
        "ingredients": ingredients_list,
        "allergens": allergens_list,
        "description": p.description or ""
    }


def get_next_serial_number(db: Session) -> Optional[int]:
    """Find the lowest available serial number slot from 1 to 20."""
    existing_serials = set(s[0] for s in db.query(ManagedProduct.serial_number).all())
    for s in range(1, 21):
        if s not in existing_serials:
            return s
    return None


def format_barcode_for_serial(serial_num: int) -> str:
    """Format deterministic 12-digit barcode matching 890100000001 to 890100000020."""
    return f"8901000000{serial_num:02d}"


@router.get("/products", response_model=List[ManagedProductOut])
def list_products(db: Session = Depends(get_db)):
    """List all registered products (up to 20), sorted by serialNumber."""
    # Ensure any non-standard barcodes are migrated to standard 8901000000XX format
    products = db.query(ManagedProduct).order_by(ManagedProduct.serial_number.asc()).all()
    migrated = False
    for p in products:
        expected_barcode = format_barcode_for_serial(p.serial_number)
        if p.barcode != expected_barcode:
            p.barcode = expected_barcode
            migrated = True
    if migrated:
        db.commit()

    return [serialize_product(p) for p in products]


@router.post("/products", response_model=ManagedProductOut)
def create_product(product_in: ManagedProductCreate, db: Session = Depends(get_db)):
    """
    Register a new food product.
    Automatically assigns next available serial number (1-20) and unique barcode 8901000000XX.
    Never exceeds 20 products.
    """
    count = db.query(ManagedProduct).count()
    if count >= 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 20 products registered. Please delete a product before adding a new one."
        )

    next_serial = get_next_serial_number(db)
    if not next_serial:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 20 products registered."
        )

    barcode = format_barcode_for_serial(next_serial)

    # Check if barcode unexpectedly collisioned
    existing_bc = db.query(ManagedProduct).filter(ManagedProduct.barcode == barcode).first()
    if existing_bc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Barcode {barcode} is already in use by serial {existing_bc.serial_number}."
        )

    new_prod = ManagedProduct(
        serial_number=next_serial,
        barcode=barcode,
        product_name=product_in.productName.strip(),
        brand_name=(product_in.brandName or "").strip(),
        category=(product_in.category or "").strip(),
        serving_size=(product_in.servingSize or "").strip(),
        calories=float(product_in.calories or 0),
        protein=float(product_in.protein or 0),
        carbohydrates=float(product_in.carbohydrates or 0),
        fat=float(product_in.fat or 0),
        sugar=float(product_in.sugar or 0),
        fiber=float(product_in.fiber or 0),
        sodium=float(product_in.sodium or 0),
        ingredients=json.dumps(product_in.ingredients or []),
        allergens=json.dumps(product_in.allergens or []),
        description=(product_in.description or "").strip()
    )

    db.add(new_prod)
    db.commit()
    db.refresh(new_prod)
    return serialize_product(new_prod)


@router.get("/products/{serial_number}", response_model=ManagedProductOut)
def get_product(serial_number: int, db: Session = Depends(get_db)):
    prod = db.query(ManagedProduct).filter(ManagedProduct.serial_number == serial_number).first()
    if not prod:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with serial number {serial_number} not found."
        )
    return serialize_product(prod)


@router.get("/lookup/{barcode}", response_model=ManagedProductOut)
def lookup_product_by_barcode(barcode: str, db: Session = Depends(get_db)):
    """Lookup product strictly by barcode in 20-product database."""
    clean_barcode = barcode.strip().replace(" ", "").replace("-", "")
    prod = db.query(ManagedProduct).filter(ManagedProduct.barcode == clean_barcode).first()
    if not prod:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product Not Found. This barcode is not registered in your 20-product database."
        )
    return serialize_product(prod)


@router.put("/products/{serial_number}", response_model=ManagedProductOut)
def update_product(serial_number: int, update_in: ManagedProductUpdate, db: Session = Depends(get_db)):
    """
    Update product details.
    IMPORTANT: Preserves serial_number and barcode! They CANNOT be modified.
    """
    prod = db.query(ManagedProduct).filter(ManagedProduct.serial_number == serial_number).first()
    if not prod:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with serial number {serial_number} not found."
        )

    if update_in.productName is not None:
        prod.product_name = update_in.productName.strip()
    if update_in.brandName is not None:
        prod.brand_name = update_in.brandName.strip()
    if update_in.category is not None:
        prod.category = update_in.category.strip()
    if update_in.servingSize is not None:
        prod.serving_size = update_in.servingSize.strip()
    if update_in.calories is not None:
        prod.calories = float(update_in.calories)
    if update_in.protein is not None:
        prod.protein = float(update_in.protein)
    if update_in.carbohydrates is not None:
        prod.carbohydrates = float(update_in.carbohydrates)
    if update_in.fat is not None:
        prod.fat = float(update_in.fat)
    if update_in.sugar is not None:
        prod.sugar = float(update_in.sugar)
    if update_in.fiber is not None:
        prod.fiber = float(update_in.fiber)
    if update_in.sodium is not None:
        prod.sodium = float(update_in.sodium)
    if update_in.ingredients is not None:
        prod.ingredients = json.dumps(update_in.ingredients)
    if update_in.allergens is not None:
        prod.allergens = json.dumps(update_in.allergens)
    if update_in.description is not None:
        prod.description = update_in.description.strip()

    db.commit()
    db.refresh(prod)
    return serialize_product(prod)


@router.delete("/products/{serial_number}")
def delete_product(serial_number: int, db: Session = Depends(get_db)):
    """
    Delete a product by serial number.
    Does NOT shift or renumber other products.
    """
    prod = db.query(ManagedProduct).filter(ManagedProduct.serial_number == serial_number).first()
    if not prod:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with serial number {serial_number} not found."
        )

    db.delete(prod)
    db.commit()
    return {"message": f"Product with serial number {serial_number} deleted successfully."}


@router.post("/reset")
def reset_all_products(db: Session = Depends(get_db)):
    """Reset all 20 products in the database."""
    count = db.query(ManagedProduct).delete()
    db.commit()
    return {"message": f"All {count} products have been reset.", "deleted_count": count}


# Legacy POST /lookup fallback for backwards compatibility
class LegacyBarcodeRequest(BaseModel):
    barcode: str

class LegacyBarcodeResponse(BaseModel):
    product_name: Optional[str] = None
    serving_size: Optional[str] = None
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None
    message: str

@router.post("/lookup", response_model=LegacyBarcodeResponse)
def legacy_lookup(request: LegacyBarcodeRequest, db: Session = Depends(get_db)):
    clean_barcode = request.barcode.strip().replace(" ", "").replace("-", "")
    prod = db.query(ManagedProduct).filter(ManagedProduct.barcode == clean_barcode).first()
    if prod:
        return LegacyBarcodeResponse(
            product_name=prod.product_name,
            serving_size=prod.serving_size,
            calories=prod.calories,
            protein=prod.protein,
            carbs=prod.carbohydrates,
            fat=prod.fat,
            message="Product found"
        )
    return LegacyBarcodeResponse(message="Product Not Found. This barcode is not registered in your 20-product database.")
