import json
import re
from typing import List, Optional
import httpx
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


# ─── NUTRILENS LIVE EXTERNAL BARCODE LOOKUP (RULE 3, 6, 7, 8) ───────────────

class BarcodeProductResponse(BaseModel):
    barcode: str
    product_name: str
    brand: str
    image_url: Optional[str] = None
    quantity: Optional[str] = None
    serving_size: Optional[str] = None
    serving_weight_g: float = 100.0

    # Values per 100g
    calories_100g: float = 0.0
    protein_100g: float = 0.0
    carbs_100g: float = 0.0
    sugar_100g: float = 0.0
    fat_100g: float = 0.0
    sat_fat_100g: float = 0.0
    sodium_mg_100g: float = 0.0
    salt_100g: float = 0.0
    fiber_100g: float = 0.0

    # Values per serving (optional)
    calories_serving: Optional[float] = None
    protein_serving: Optional[float] = None
    carbs_serving: Optional[float] = None
    sugar_serving: Optional[float] = None
    fat_serving: Optional[float] = None
    sat_fat_serving: Optional[float] = None
    sodium_mg_serving: Optional[float] = None

    ingredients_text: str = ""
    ingredients: List[str] = []
    allergens: List[str] = []
    nutriscore_grade: Optional[str] = None
    nova_group: Optional[int] = None
    source: str = "Open Food Facts"
    source_url: str = ""
    assessment: Optional[str] = None
    found: bool = True


def generate_nutrilens_assessment(
    name: str,
    cal_100: float,
    prot_100: float,
    sugar_100: float,
    fat_100: float,
    sat_fat_100: float,
    sod_mg_100: float,
    fiber_100: float,
    nutriscore: Optional[str] = None
) -> str:
    """Generate transparent, simple language nutrition summary per RULE 7."""
    strengths = []
    considerations = []

    if prot_100 >= 10.0:
        strengths.append(f"High protein density ({prot_100}g per 100g)")
    elif prot_100 >= 5.0:
        strengths.append(f"Moderate protein source ({prot_100}g per 100g)")

    if fiber_100 >= 3.0:
        strengths.append(f"Good source of dietary fiber ({fiber_100}g per 100g)")

    if sugar_100 <= 5.0 and cal_100 > 0:
        strengths.append("Low in added sugars (<=5g per 100g)")
    elif sugar_100 > 15.0:
        considerations.append(f"Elevated sugar density ({sugar_100}g per 100g)")

    if sat_fat_100 > 5.0:
        considerations.append(f"High saturated fat ({sat_fat_100}g per 100g)")
    elif sat_fat_100 <= 1.5 and fat_100 > 0:
        strengths.append("Low saturated fat profile")

    if sod_mg_100 > 600.0:
        considerations.append(f"High sodium ({int(sod_mg_100)}mg per 100g)")
    elif sod_mg_100 <= 140.0:
        strengths.append("Low sodium formulation")

    grade_note = f"Source Nutri-Score: Grade {nutriscore.upper()}." if nutriscore else "No official manufacturer Nutri-Score provided."
    strengths_str = "; ".join(strengths) if strengths else "Balanced baseline macronutrient distribution."
    considerations_str = "; ".join(considerations) if considerations else "No high-risk nutritional flags detected."

    return (
        f"NutriLens Assessment for {name}: {grade_note} "
        f"Strengths: {strengths_str}. "
        f"Considerations: {considerations_str}. "
        f"Disclaimer: Nutritional evaluation is derived from Open Food Facts verified food records. "
        f"It is for general health awareness and is not clinical diagnosis or medical treatment."
    )


@router.get("/{barcode}", response_model=BarcodeProductResponse)
async def get_barcode_product(barcode: str, db: Session = Depends(get_db)):
    """
    Search and retrieve verified food product information by barcode.
    Accepts 6-14 digit GTIN, EAN-13, EAN-8, UPC-A, and UPC-E barcodes.
    Queries internal registry first, then queries Open Food Facts API v2.
    """
    clean_code = barcode.strip().replace(" ", "").replace("-", "")
    if not clean_code or not clean_code.isdigit() or len(clean_code) < 6 or len(clean_code) > 14:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid barcode format. Expected a 6 to 14 digit numeric barcode."
        )

    # 1. Check local database first
    local_prod = db.query(ManagedProduct).filter(ManagedProduct.barcode == clean_code).first()
    if local_prod:
        ing_list = []
        try:
            ing_list = json.loads(local_prod.ingredients) if local_prod.ingredients else []
        except Exception:
            ing_list = [i.strip() for i in local_prod.ingredients.split(",") if i.strip()] if local_prod.ingredients else []

        all_list = []
        try:
            all_list = json.loads(local_prod.allergens) if local_prod.allergens else []
        except Exception:
            all_list = [a.strip() for a in local_prod.allergens.split(",") if a.strip()] if local_prod.allergens else []

        assessment = generate_nutrilens_assessment(
            local_prod.product_name,
            float(local_prod.calories or 0),
            float(local_prod.protein or 0),
            float(local_prod.sugar or 0),
            float(local_prod.fat or 0),
            0.0,
            float(local_prod.sodium or 0),
            float(local_prod.fiber or 0)
        )

        return BarcodeProductResponse(
            barcode=local_prod.barcode,
            product_name=local_prod.product_name,
            brand=local_prod.brand_name or "Internal Registry",
            quantity=None,
            serving_size=local_prod.serving_size or "100g",
            serving_weight_g=100.0,
            calories_100g=float(local_prod.calories or 0),
            protein_100g=float(local_prod.protein or 0),
            carbs_100g=float(local_prod.carbohydrates or 0),
            sugar_100g=float(local_prod.sugar or 0),
            fat_100g=float(local_prod.fat or 0),
            sat_fat_100g=0.0,
            sodium_mg_100g=float(local_prod.sodium or 0),
            salt_100g=round(float(local_prod.sodium or 0) * 2.5 / 1000, 2),
            fiber_100g=float(local_prod.fiber or 0),
            ingredients_text=", ".join(ing_list) if ing_list else "Not available",
            ingredients=ing_list,
            allergens=all_list,
            source="NutriLens Internal Registry",
            source_url="/scan/barcode",
            assessment=assessment,
            found=True
        )

    # 2. Query Open Food Facts external provider
    off_url = f"https://world.openfoodfacts.org/api/v2/product/{clean_code}.json"
    headers = {
        "User-Agent": "NutriLensAI/1.0 (https://nutri-ai-eight-iota.vercel.app; support@nutrilens.app)"
    }

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(off_url, headers=headers)
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Open Food Facts provider timed out. Please try again."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to connect to external barcode provider."
        )

    if resp.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with barcode '{clean_code}' not found."
        )

    try:
        data = resp.json()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Invalid response received from external provider."
        )

    if data.get("status") != 1 or not data.get("product"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with barcode '{clean_code}' not found in Open Food Facts database."
        )

    p = data["product"]
    nutriments = p.get("nutriments") or {}

    def parse_float(val, fallback=0.0):
        try:
            v = float(val)
            return fallback if (v != v) else max(0.0, v)
        except (ValueError, TypeError):
            return fallback

    # Calories per 100g: Check energy-kcal or convert kJ
    cal_100 = parse_float(nutriments.get("energy-kcal_100g") or nutriments.get("energy-kcal_value") or nutriments.get("energy-kcal"))
    if not cal_100 and nutriments.get("energy_100g"):
        cal_100 = round(parse_float(nutriments.get("energy_100g")) / 4.184, 1)

    prot_100 = round(parse_float(nutriments.get("proteins_100g")), 1)
    carbs_100 = round(parse_float(nutriments.get("carbohydrates_100g")), 1)
    sugar_100 = round(parse_float(nutriments.get("sugars_100g")), 1)
    fat_100 = round(parse_float(nutriments.get("fat_100g")), 1)
    sat_fat_100 = round(parse_float(nutriments.get("saturated-fat_100g")), 1)
    fiber_100 = round(parse_float(nutriments.get("fiber_100g")), 1)
    salt_100 = round(parse_float(nutriments.get("salt_100g")), 2)

    # Sodium: OFF reports sodium in grams per 100g. Convert to mg.
    sod_g = parse_float(nutriments.get("sodium_100g"))
    if not sod_g and salt_100:
        sod_g = salt_100 / 2.5
    sod_mg_100 = round(sod_g * 1000.0, 1)

    # Serving size and serving weight
    serving_str = p.get("serving_size") or "100g"
    serving_weight_g = parse_float(p.get("serving_quantity"), 0.0)
    if not serving_weight_g:
        match = re.search(r"(\d+(?:\.\d+)?)\s*g", serving_str, re.IGNORECASE)
        if match:
            serving_weight_g = parse_float(match.group(1), 100.0)
        else:
            serving_weight_g = 100.0

    # Optional serving values
    cal_serving = parse_float(nutriments.get("energy-kcal_serving")) or None
    prot_serving = parse_float(nutriments.get("proteins_serving")) or None
    carbs_serving = parse_float(nutriments.get("carbohydrates_serving")) or None
    sugar_serving = parse_float(nutriments.get("sugars_serving")) or None
    fat_serving = parse_float(nutriments.get("fat_serving")) or None
    sat_fat_serving = parse_float(nutriments.get("saturated-fat_serving")) or None
    sod_serving_g = parse_float(nutriments.get("sodium_serving"))
    sod_mg_serving = round(sod_serving_g * 1000.0, 1) if sod_serving_g else None

    # Ingredients & allergens cleanup
    raw_allergens = p.get("allergens_tags") or []
    cleaned_allergens = [
        re.sub(r"^[a-z]{2}:", "", a).replace("-", " ").strip()
        for a in raw_allergens if a
    ]
    raw_ingredients = p.get("ingredients") or []
    ingredient_names = [
        item.get("text", "").strip() for item in raw_ingredients if isinstance(item, dict) and item.get("text")
    ]

    nutriscore = (p.get("nutriscore_grade") or "").upper() or None
    nova = p.get("nova_group")
    if nova is not None:
        try:
            nova = int(nova)
        except (ValueError, TypeError):
            nova = None

    assessment = generate_nutrilens_assessment(
        p.get("product_name") or "Product",
        cal_100, prot_100, sugar_100, fat_100, sat_fat_100, sod_mg_100, fiber_100, nutriscore
    )

    return BarcodeProductResponse(
        barcode=clean_code,
        product_name=p.get("product_name") or p.get("product_name_en") or p.get("generic_name") or "Verified Product",
        brand=p.get("brands") or p.get("brand_owner") or "Verified Brand",
        image_url=p.get("image_front_url") or p.get("image_url") or p.get("image_small_url"),
        quantity=p.get("quantity") or None,
        serving_size=serving_str,
        serving_weight_g=round(serving_weight_g, 1),
        calories_100g=round(cal_100, 1),
        protein_100g=prot_100,
        carbs_100g=carbs_100,
        sugar_100g=sugar_100,
        fat_100g=fat_100,
        sat_fat_100g=sat_fat_100,
        sodium_mg_100g=sod_mg_100,
        salt_100g=salt_100,
        fiber_100g=fiber_100,
        calories_serving=round(cal_serving, 1) if cal_serving else None,
        protein_serving=round(prot_serving, 1) if prot_serving else None,
        carbs_serving=round(carbs_serving, 1) if carbs_serving else None,
        sugar_serving=round(sugar_serving, 1) if sugar_serving else None,
        fat_serving=round(fat_serving, 1) if fat_serving else None,
        sat_fat_serving=round(sat_fat_serving, 1) if sat_fat_serving else None,
        sodium_mg_serving=sod_mg_serving,
        ingredients_text=p.get("ingredients_text") or p.get("ingredients_text_en") or "Ingredients not supplied by manufacturer.",
        ingredients=ingredient_names[:25],
        allergens=cleaned_allergens,
        nutriscore_grade=nutriscore,
        nova_group=nova,
        source="Open Food Facts",
        source_url=f"https://world.openfoodfacts.org/product/{clean_code}",
        assessment=assessment,
        found=True
    )

