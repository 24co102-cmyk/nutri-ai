# backend/app/services/food_catalog.py
"""
NutriLens AI — Food Reference Catalog Service
Loads the 233-item NutriEmotion Food Reference Starter Catalog,
provides normalized matching, multi-item portion calculation,
and imports reference foods into the database without deleting existing records.
"""

import json
import os
import re
from pathlib import Path
from typing import Optional, Dict, Any, List, Tuple
from sqlalchemy.orm import Session

# Locate catalog file
_CATALOG_PATHS = [
    Path(__file__).resolve().parent.parent / "data" / "food_reference" / "food_catalog.json",
    Path(__file__).resolve().parent.parent.parent / "data" / "food_reference" / "food_catalog.json",
    Path("backend/app/data/food_reference/food_catalog.json"),
    Path("food_catalog.json"),
]

_catalog_data: Optional[Dict[str, Any]] = None
_by_name: Dict[str, Dict[str, Any]] = {}
_by_alias: Dict[str, Dict[str, Any]] = {}
_by_id: Dict[str, Dict[str, Any]] = {}


def _normalize_text(text: str) -> str:
    """Normalize text for consistent comparison: lowercase, strip punctuation, remove extra spaces."""
    cleaned = re.sub(r"[^a-zA-Z0-9\s]", " ", text.casefold())
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def _stem_simple(word: str) -> str:
    """Basic plural to singular normalization."""
    if word.endswith("ies") and len(word) > 4:
        return word[:-3] + "y"
    if word.endswith("es") and len(word) > 3 and word[-3] in "sxo":
        return word[:-2]
    if word.endswith("s") and not word.endswith("ss") and len(word) > 2:
        return word[:-1]
    return word


def load_catalog() -> Dict[str, Any]:
    global _catalog_data, _by_name, _by_alias, _by_id
    if _catalog_data is not None:
        return _catalog_data

    catalog_file = None
    for p in _CATALOG_PATHS:
        if p.exists():
            catalog_file = p
            break

    if not catalog_file:
        print("[Food Catalog Warning] food_catalog.json not found in search paths.")
        _catalog_data = {"items": [], "item_count": 0}
        return _catalog_data

    try:
        with open(catalog_file, "r", encoding="utf-8") as f:
            _catalog_data = json.load(f)
    except Exception as e:
        print(f"[Food Catalog Error] Failed to load {catalog_file}: {e}")
        _catalog_data = {"items": [], "item_count": 0}
        return _catalog_data

    # Build lookup indices
    _by_name.clear()
    _by_alias.clear()
    _by_id.clear()

    for item in _catalog_data.get("items", []):
        cid = item.get("id")
        if cid:
            _by_id[cid] = item

        cname = item.get("name", "")
        if cname:
            _by_name[_normalize_text(cname)] = item

        for alias in item.get("aliases", []):
            if alias:
                _by_alias[_normalize_text(alias)] = item

    return _catalog_data


def get_all_catalog_items() -> List[Dict[str, Any]]:
    load_catalog()
    return _catalog_data.get("items", []) if _catalog_data else []


def get_catalog_item_by_id(catalog_id: str) -> Optional[Dict[str, Any]]:
    load_catalog()
    return _by_id.get(catalog_id)


def match_food_in_catalog(name: str) -> Optional[Dict[str, Any]]:
    """
    Attempt to match a recognized food name against the 233-item reference catalog.
    Returns the catalog item dictionary if a confident match is found, otherwise None.
    NEVER invents a match.
    """
    if not name or not name.strip():
        return None

    load_catalog()
    norm = _normalize_text(name)

    # 1. Direct name lookup
    if norm in _by_name:
        return _by_name[norm]

    # 2. Direct alias lookup
    if norm in _by_alias:
        return _by_alias[norm]

    # 3. Singular form lookup
    tokens = norm.split()
    stemmed = " ".join(_stem_simple(w) for w in tokens)
    if stemmed in _by_name:
        return _by_name[stemmed]
    if stemmed in _by_alias:
        return _by_alias[stemmed]

    # 4. Strip common recipe/prep prefixes/suffixes (e.g. "cooked", "raw", "fresh", "steamed", "grilled", "fried", "bowl of", "plate of")
    stripped = re.sub(
        r"\b(cooked|raw|fresh|steamed|grilled|fried|boiled|baked|roasted|mashed|sliced|chopped|bowl of|plate of|serving of|dish of)\b",
        "",
        norm,
    ).strip()
    stripped = re.sub(r"\s+", " ", stripped).strip()

    if stripped:
        if stripped in _by_name:
            return _by_name[stripped]
        if stripped in _by_alias:
            return _by_alias[stripped]

        stripped_stemmed = " ".join(_stem_simple(w) for w in stripped.split())
        if stripped_stemmed in _by_name:
            return _by_name[stripped_stemmed]
        if stripped_stemmed in _by_alias:
            return _by_alias[stripped_stemmed]

    # 5. Exact substring matching where catalog entry is contained as a distinct key phrase
    # E.g. "Spicy chicken biryani" -> "chicken biryani"
    candidates = []
    for c_norm, item in _by_name.items():
        if len(c_norm) >= 3 and (f" {c_norm} " in f" {norm} " or f" {c_norm} " in f" {stripped} "):
            candidates.append((len(c_norm), item))

    if candidates:
        candidates.sort(key=lambda x: x[0], reverse=True)
        return candidates[0][1]

    # 6. Alias substring matching
    for a_norm, item in _by_alias.items():
        if len(a_norm) >= 3 and (f" {a_norm} " in f" {norm} " or f" {a_norm} " in f" {stripped} "):
            candidates.append((len(a_norm), item))

    if candidates:
        candidates.sort(key=lambda x: x[0], reverse=True)
        return candidates[0][1]

    return None


def calculate_nutrition_for_portion(
    item: Dict[str, Any],
    grams: float = 100.0,
    quantity_multiplier: float = 1.0,
) -> Dict[str, Any]:
    """
    Calculate scaled nutrition values for a catalog item based on weight in grams.
    """
    effective_grams = max(1.0, grams * max(0.1, quantity_multiplier))
    factor = effective_grams / 100.0

    raw_nutr = item.get("nutrition_per_100g", {})
    calories = round(float(raw_nutr.get("calories_kcal", 0.0)) * factor, 1)
    protein = round(float(raw_nutr.get("protein_g", 0.0)) * factor, 1)
    carbs = round(float(raw_nutr.get("carbohydrates_g", 0.0)) * factor, 1)
    fat = round(float(raw_nutr.get("fat_g", 0.0)) * factor, 1)
    fiber = round(float(raw_nutr.get("fiber_g", 0.0)) * factor, 1)
    sugar = round(float(raw_nutr.get("sugar_g", 0.0)) * factor, 1)
    sodium = round(float(raw_nutr.get("sodium_mg", 0.0)) * factor, 1)

    image_file = item.get("image_file", "")
    filename = Path(image_file).name if image_file else ""
    image_url = f"/food_reference_images/{filename}" if filename else None

    return {
        "catalog_id": item.get("id"),
        "name": item.get("name"),
        "category": item.get("category", "Meal"),
        "serving_grams": round(effective_grams, 1),
        "typical_serving": item.get("typical_serving", "100 g"),
        "calories": calories,
        "protein_g": protein,
        "carbs_g": carbs,
        "fat_g": fat,
        "fiber_g": fiber,
        "sugar_g": sugar,
        "sodium_mg": sodium,
        "notes": item.get("notes", "Generic reference estimate."),
        "image_file": image_file,
        "image_url": image_url,
        "matched_catalog": True,
        "is_approximate": item.get("nutrition_is_approximate", True),
        "source": "NutriEmotion Food Reference Catalog",
    }


def import_catalog_into_db(db: Session) -> Tuple[int, int]:
    """
    Import all 233 items from food_catalog.json into the database 'foods' table.
    Preserves all existing records; enriches matching names or inserts new ones.
    Returns (created_count, updated_count).
    """
    from .. import models

    items = get_all_catalog_items()
    if not items:
        return 0, 0

    created_count = 0
    updated_count = 0

    for item in items:
        name = item.get("name", "").strip()
        if not name:
            continue

        raw_nutr = item.get("nutrition_per_100g", {})
        cal = float(raw_nutr.get("calories_kcal", 0.0))
        prot = float(raw_nutr.get("protein_g", 0.0))
        carbs = float(raw_nutr.get("carbohydrates_g", 0.0))
        fat = float(raw_nutr.get("fat_g", 0.0))
        fiber = float(raw_nutr.get("fiber_g", 0.0))
        sugar_str = f"{raw_nutr.get('sugar_g', 0.0)}g"
        sod_str = f"{raw_nutr.get('sodium_mg', 0.0)}mg"
        serving = item.get("typical_serving", "100 g")
        cat = item.get("category", "")
        notes = item.get("notes", "")
        img = item.get("image_file", "")
        aliases_str = ",".join(item.get("aliases", []))
        cid = item.get("id", "")

        existing = db.query(models.Food).filter(models.Food.name.ilike(name)).first()

        if existing:
            # Enrich existing record without overwriting non-default custom fields
            if hasattr(existing, "catalog_id") and not existing.catalog_id:
                existing.catalog_id = cid
            if hasattr(existing, "category") and not existing.category:
                existing.category = cat
            if hasattr(existing, "fiber") and existing.fiber is None:
                existing.fiber = fiber
            if hasattr(existing, "notes") and not existing.notes:
                existing.notes = notes
            if hasattr(existing, "image_file") and not existing.image_file:
                existing.image_file = img
            if hasattr(existing, "aliases") and not existing.aliases:
                existing.aliases = aliases_str
            updated_count += 1
        else:
            # Create new food record
            new_food = models.Food(
                name=name,
                serving_size=serving,
                calories=cal,
                protein=prot,
                carbs=carbs,
                fat=fat,
                sugar=sugar_str,
                sodium=sod_str,
                ingredients=notes or "Reference starter catalog ingredient",
                allergens="None recorded in reference catalog",
                nutrition_grade="B+",
            )
            # Set extended catalog columns if model supports them
            if hasattr(new_food, "catalog_id"):
                new_food.catalog_id = cid
            if hasattr(new_food, "category"):
                new_food.category = cat
            if hasattr(new_food, "fiber"):
                new_food.fiber = fiber
            if hasattr(new_food, "notes"):
                new_food.notes = notes
            if hasattr(new_food, "image_file"):
                new_food.image_file = img
            if hasattr(new_food, "aliases"):
                new_food.aliases = aliases_str

            db.add(new_food)
            created_count += 1

    db.commit()
    return created_count, updated_count
