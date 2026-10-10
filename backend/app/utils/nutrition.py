from math import floor

def calculate_bmi(weight_kg: float, height_cm: float) -> float:
    if height_cm <= 0:
        return 0.0
    height_m = height_cm / 100.0
    return weight_kg / (height_m ** 2)

def calculate_bmr(sex: str, weight_kg: float, height_cm: float, age: int) -> float:
    """Mifflin‑St Jeor Equation"""
    if sex.lower() == "male":
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
    else:
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
    return bmr

def activity_factor(level: str) -> float:
    mapping = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "very active": 1.725,
    }
    return mapping.get(level.lower(), 1.2)

def calculate_daily_calorie_target(bmr: float, activity_lvl: str, goal: str) -> float:
    factor = activity_factor(activity_lvl)
    maintenance = bmr * factor
    # Adjust for goal (simple +/- 10% for gain/loss, +5% for maintenance, +15% for muscle building)
    if goal.lower() == "weight loss":
        return maintenance * 0.9
    if goal.lower() == "weight gain":
        return maintenance * 1.1
    if goal.lower() == "muscle building":
        return maintenance * 1.15
    # default maintenance
    return maintenance

def calculate_macro_targets(daily_calories: float) -> dict:
    # Simple macro split: 30% protein, 45% carbs, 25% fat
    protein_kcal = daily_calories * 0.30
    carbs_kcal = daily_calories * 0.45
    fat_kcal = daily_calories * 0.25
    return {
        "protein": protein_kcal / 4,  # 4 kcal per gram
        "carbs": carbs_kcal / 4,
        "fat": fat_kcal / 9,
    }
