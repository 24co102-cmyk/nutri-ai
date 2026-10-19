import json
from pathlib import Path

CATALOG = json.loads(Path("food_catalog.json").read_text(encoding="utf-8"))
BY_NAME = {item["name"].casefold(): item for item in CATALOG["items"]}

def lookup_food(name: str, grams: float = 100):
    item = BY_NAME.get(name.casefold())
    if not item:
        return None
    factor = grams / 100.0
    nutrition = {
        key: round(value * factor, 2)
        for key, value in item["nutrition_per_100g"].items()
    }
    return {
        "name": item["name"],
        "category": item["category"],
        "serving_grams": grams,
        "nutrition_estimate": nutrition,
        "notes": item["notes"],
        "image_file": item["image_file"],
        "is_approximate": True,
    }

if __name__ == "__main__":
    print(lookup_food("Banana", 120))
