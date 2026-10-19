# NutriEmotion AI Food Reference Starter Catalog

Catalog size: 233 foods and ingredients.

## Files
- `food_catalog.json`: structured data for backend integration.
- `food_catalog.csv`: spreadsheet-friendly reference.
- `images/`: one labeled illustrative SVG reference card per catalog item.
- `integration_example.py`: small example of looking up a food name and scaling nutrition by grams.

## Important limitations
This is a starter catalog, not literally every fruit, vegetable, regional dish, brand, or recipe in the world.
Nutrition values are generic estimates per 100 g and may be inaccurate for a specific recipe or brand.
The SVG images are illustrations, NOT real photographs and NOT a food-image training dataset.
A working scanner must use a vision-capable AI model to analyze actual uploaded photos. Use this catalog as a lookup/reference layer, not as a substitute for image recognition.
For stronger nutrition accuracy, connect a verified nutrition database/API and show its source.
Do not claim exact calories, ingredients, or allergen safety from a photo alone.
