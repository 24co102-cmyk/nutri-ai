# backend/app/api/moods.py
"""
NutriLens AI — Emotion & Mood Tracking API Router
Provides comprehensive mood logging, private journaling, analytics,
food-mood correlation, and ethical AI wellness reflections.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import os
import re

from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_user
from ..config import GEMINI_API_KEY
from .chat import get_gemini_client, GEMINI_MODELS

router = APIRouter()

# Normalized valid moods mapping (lowercase -> canonical title case)
MOOD_MAP = {m.lower(): m for m in schemas.VALID_MOODS}


def _normalize_mood(raw_mood: str) -> str:
    cleaned = raw_mood.strip().lower()
    if cleaned in MOOD_MAP:
        return MOOD_MAP[cleaned]
    valid_str = ", ".join(schemas.VALID_MOODS)
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Invalid mood '{raw_mood}'. Supported moods are: {valid_str}"
    )


def _serialize_tags(tags: Optional[List[str]]) -> Optional[str]:
    if not tags:
        return None
    cleaned = [t.strip().lower() for t in tags if t and t.strip()]
    return ",".join(cleaned) if cleaned else None


def _deserialize_tags(tag_str: Optional[str]) -> List[str]:
    if not tag_str:
        return []
    return [t.strip() for t in tag_str.split(",") if t.strip()]


def _format_entry_out(entry: models.MoodEntry) -> schemas.MoodEntryOut:
    linked_meal = None
    if entry.meal:
        linked_meal = schemas.LinkedMealSummary(
            id=entry.meal.id,
            meal_type=entry.meal.meal_type,
            total_calories=entry.meal.total_calories or 0.0,
            date=entry.meal.date,
        )

    return schemas.MoodEntryOut(
        id=entry.id,
        user_id=entry.user_id,
        mood=entry.mood,
        intensity=entry.intensity,
        duration=entry.duration,
        tags=_deserialize_tags(entry.tags),
        journal_note=entry.journal_note,
        meal_id=entry.meal_id,
        meal=linked_meal,
        hunger_level=entry.hunger_level,
        cravings=entry.cravings,
        water_intake=entry.water_intake,
        sleep_hours=entry.sleep_hours,
        date=entry.date,
        created_at=entry.created_at,
        updated_at=entry.updated_at,
    )


# ── 1. Create Mood Entry ───────────────────────────────────────────────────────
@router.post("/", response_model=schemas.MoodEntryOut, status_code=status.HTTP_201_CREATED)
def create_mood_entry(
    entry_in: schemas.MoodEntryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    normalized_mood = _normalize_mood(entry_in.mood)

    # Validate intensity
    if entry_in.intensity is not None and not (1 <= entry_in.intensity <= 5):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mood intensity must be between 1 and 5"
        )

    # Validate journal note length
    if entry_in.journal_note and len(entry_in.journal_note) > 3000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Journal note exceeds maximum limit of 3000 characters"
        )

    # Validate linked meal ownership
    if entry_in.meal_id:
        meal = db.query(models.Meal).filter(
            models.Meal.id == entry_in.meal_id,
            models.Meal.user_id == current_user.id
        ).first()
        if not meal:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Referenced meal not found in your meal logs"
            )

    # Parse date if provided
    entry_date = datetime.utcnow()
    if entry_in.date:
        if isinstance(entry_in.date, datetime):
            entry_date = entry_in.date
        elif isinstance(entry_in.date, str):
            try:
                # Handle ISO formats
                entry_date = datetime.fromisoformat(entry_in.date.replace("Z", "+00:00"))
            except ValueError:
                try:
                    entry_date = datetime.strptime(entry_in.date, "%Y-%m-%d")
                except ValueError:
                    pass

    new_entry = models.MoodEntry(
        user_id=current_user.id,
        mood=normalized_mood,
        intensity=entry_in.intensity,
        duration=entry_in.duration,
        tags=_serialize_tags(entry_in.tags),
        journal_note=entry_in.journal_note.strip() if entry_in.journal_note else None,
        meal_id=entry_in.meal_id,
        hunger_level=entry_in.hunger_level,
        cravings=entry_in.cravings,
        water_intake=entry_in.water_intake,
        sleep_hours=entry_in.sleep_hours,
        date=entry_date,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    # If linked meal exists, optionally annotate meal mood
    if entry_in.meal_id:
        meal = db.query(models.Meal).filter(models.Meal.id == entry_in.meal_id).first()
        if meal and not meal.mood:
            meal.mood = normalized_mood
            db.commit()

    return _format_entry_out(new_entry)


# ── 2. List Mood Entries with Filters & Pagination ────────────────────────────
@router.get("/", response_model=List[schemas.MoodEntryOut])
def list_mood_entries(
    skip: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(50, ge=1, le=100, description="Page limit"),
    start_date: Optional[str] = Query(None, description="Filter from date (YYYY-MM-DD or ISO)"),
    end_date: Optional[str] = Query(None, description="Filter to date (YYYY-MM-DD or ISO)"),
    mood: Optional[str] = Query(None, description="Filter by mood label"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    query = (
        db.query(models.MoodEntry)
        .options(joinedload(models.MoodEntry.meal))
        .filter(models.MoodEntry.user_id == current_user.id)
    )

    if mood:
        norm = mood.strip().lower()
        if norm in MOOD_MAP:
            query = query.filter(models.MoodEntry.mood == MOOD_MAP[norm])

    if start_date:
        try:
            sd = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        except ValueError:
            try:
                sd = datetime.strptime(start_date, "%Y-%m-%d")
            except ValueError:
                sd = None
        if sd:
            query = query.filter(models.MoodEntry.date >= sd)

    if end_date:
        try:
            ed = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
        except ValueError:
            try:
                ed = datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1, microseconds=-1)
            except ValueError:
                ed = None
        if ed:
            query = query.filter(models.MoodEntry.date <= ed)

    entries = (
        query.order_by(models.MoodEntry.date.desc(), models.MoodEntry.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return [_format_entry_out(e) for e in entries]


# ── 3. Mood Analytics ──────────────────────────────────────────────────────────
@router.get("/analytics", response_model=schemas.MoodAnalyticsOut)
def get_mood_analytics(
    days: int = Query(30, ge=1, le=365, description="Lookback window in days"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    since = datetime.utcnow() - timedelta(days=days)

    entries = (
        db.query(models.MoodEntry)
        .filter(
            models.MoodEntry.user_id == current_user.id,
            models.MoodEntry.date >= since
        )
        .order_by(models.MoodEntry.date.asc())
        .all()
    )

    # Base distribution template with 0 counts for all canonical moods
    mood_distribution: Dict[str, int] = {m: 0 for m in schemas.VALID_MOODS}
    tag_counts: Dict[str, int] = {}
    intensity_sum = 0
    intensity_count = 0
    daily_buckets: Dict[str, Dict[str, Any]] = {}

    for e in entries:
        # Distribution
        if e.mood in mood_distribution:
            mood_distribution[e.mood] += 1
        else:
            mood_distribution[e.mood] = mood_distribution.get(e.mood, 0) + 1

        # Intensity average
        if e.intensity is not None:
            intensity_sum += e.intensity
            intensity_count += 1

        # Tags
        tags = _deserialize_tags(e.tags)
        for t in tags:
            tag_counts[t] = tag_counts.get(t, 0) + 1

        # Daily trend aggregation
        day_str = e.date.strftime("%Y-%m-%d") if e.date else "Unknown"
        if day_str not in daily_buckets:
            daily_buckets[day_str] = {
                "date": day_str,
                "intensities": [],
                "moods": [],
                "count": 0
            }
        daily_buckets[day_str]["count"] += 1
        daily_buckets[day_str]["moods"].append(e.mood)
        if e.intensity is not None:
            daily_buckets[day_str]["intensities"].append(e.intensity)

    total_checkins = len(entries)
    avg_intensity = round(intensity_sum / intensity_count, 1) if intensity_count > 0 else None

    # Most frequent mood
    most_frequent_mood = None
    if total_checkins > 0:
        sorted_moods = sorted(mood_distribution.items(), key=lambda x: x[1], reverse=True)
        if sorted_moods and sorted_moods[0][1] > 0:
            most_frequent_mood = sorted_moods[0][0]

    # Trends list sorted chronologically
    intensity_trends = []
    for day_str in sorted(daily_buckets.keys()):
        b = daily_buckets[day_str]
        avg_day_intensity = (
            round(sum(b["intensities"]) / len(b["intensities"]), 1)
            if b["intensities"] else None
        )
        # Dominant mood of the day
        dominant = max(set(b["moods"]), key=b["moods"].count) if b["moods"] else None
        intensity_trends.append({
            "date": day_str,
            "average_intensity": avg_day_intensity,
            "checkin_count": b["count"],
            "dominant_mood": dominant
        })

    # Top tags sorted by count
    top_tags = [
        {"tag": tag, "count": count}
        for tag, count in sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    ]

    return schemas.MoodAnalyticsOut(
        total_checkins=total_checkins,
        average_intensity=avg_intensity,
        mood_distribution=mood_distribution,
        most_frequent_mood=most_frequent_mood,
        intensity_trends=intensity_trends,
        top_tags=top_tags,
        date_range={
            "from": since.strftime("%Y-%m-%d"),
            "to": datetime.utcnow().strftime("%Y-%m-%d")
        }
    )


# ── 4. Food & Mood Connection ─────────────────────────────────────────────────
@router.get("/food-connection", response_model=schemas.FoodMoodCorrelationOut)
def get_food_mood_connection(
    days: int = Query(30, ge=1, le=90),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    since = datetime.utcnow() - timedelta(days=days)

    moods = (
        db.query(models.MoodEntry)
        .options(joinedload(models.MoodEntry.meal))
        .filter(
            models.MoodEntry.user_id == current_user.id,
            models.MoodEntry.date >= since
        )
        .all()
    )

    meals = (
        db.query(models.Meal)
        .filter(
            models.Meal.user_id == current_user.id,
            models.Meal.date >= since
        )
        .all()
    )

    # Group meals by date (YYYY-MM-DD)
    meals_by_date: Dict[str, List[models.Meal]] = {}
    for m in meals:
        d_str = m.date.strftime("%Y-%m-%d") if m.date else "Unknown"
        meals_by_date.setdefault(d_str, []).append(m)

    linked_count = sum(1 for m in moods if m.meal_id is not None)
    hunger_distribution: Dict[str, int] = {}
    cravings_distribution: Dict[str, int] = {}
    mood_calories: Dict[str, List[float]] = {}

    for m in moods:
        if m.hunger_level:
            hunger_distribution[m.hunger_level] = hunger_distribution.get(m.hunger_level, 0) + 1
        if m.cravings:
            cravings_distribution[m.cravings] = cravings_distribution.get(m.cravings, 0) + 1

        # Check meals on the same date
        d_str = m.date.strftime("%Y-%m-%d") if m.date else None
        day_meals = meals_by_date.get(d_str, []) if d_str else []
        if day_meals:
            day_total_cal = sum(ml.total_calories or 0 for ml in day_meals)
            mood_calories.setdefault(m.mood, []).append(day_total_cal)

    mood_calorie_averages: Dict[str, Dict[str, Any]] = {}
    for mood_label, cal_list in mood_calories.items():
        if cal_list:
            mood_calorie_averages[mood_label] = {
                "average_daily_calories": round(sum(cal_list) / len(cal_list), 1),
                "recorded_days": len(cal_list)
            }

    # Generate grounded, non-causal observations
    insights: List[str] = []
    if len(moods) == 0:
        insights.append("No mood entries logged yet in this time frame. Start by recording how you feel today.")
    else:
        # Cravings / Hunger note
        if cravings_distribution:
            top_craving = max(cravings_distribution.items(), key=lambda x: x[1])
            insights.append(f"You reported '{top_craving[0]}' cravings across {top_craving[1]} check-in(s).")
        
        # Stress or low energy mentions
        stressed_count = sum(1 for m in moods if m.mood.lower() == "stressed")
        if stressed_count > 0:
            insights.append(f"You recorded feeling 'Stressed' on {stressed_count} occasion(s) during this period.")

        # Linked meals observation
        if linked_count > 0:
            insights.append(f"You linked {linked_count} meal(s) directly to your mood check-ins.")
        
        # Day correlation note
        if mood_calorie_averages:
            insights.append(
                "On days when both meals and moods were recorded, intake patterns are summarized above. "
                "Note: These reflect observed correlations, not medical causation."
            )
        else:
            insights.append("Log both your meals and your moods to see personalized pattern summaries.")

    return schemas.FoodMoodCorrelationOut(
        total_moods_analyzed=len(moods),
        total_meals_analyzed=len(meals),
        linked_meals_count=linked_count,
        mood_calorie_averages=mood_calorie_averages,
        hunger_distribution=hunger_distribution,
        cravings_distribution=cravings_distribution,
        insights=insights
    )


# ── 5. AI Mood Insights ────────────────────────────────────────────────────────
AI_INSIGHTS_PROMPT = """You are a supportive, empathetic, and clinical-grade wellness reflection assistant for NutriLens AI.
You are reviewing self-reported mood and wellness check-in entries from the authenticated user.

CRITICAL ETHICAL & MEDICAL BOUNDARIES:
- DO NOT diagnose depression, bipolar disorder, anxiety disorders, eating disorders, or any psychiatric/medical condition.
- DO NOT prescribe medications or recommend changing existing medical prescriptions.
- DO NOT claim to determine the user's true emotional state or mental health with absolute certainty.
- DO NOT make unsupported claims that specific foods caused an emotional change (correlation is not causation).
- DO NOT infer sensitive medical conditions.
- Provide supportive, non-judgmental wellness reflections.
- Offer simple, healthy lifestyle habits: taking intentional breaks, gentle movement, adequate hydration, balanced nourishment, regular sleep, and journaling.
- Clearly distinguish observed facts from possible interpretations.

Return a concise response strictly in valid JSON matching this schema:
{
  "summary": "1-2 sentence supportive reflection on reported records",
  "patterns": ["pattern 1", "pattern 2"],
  "wellness_suggestions": ["gentle suggestion 1", "gentle suggestion 2", "gentle suggestion 3"],
  "disclaimer": "This reflection is generated by AI for informational wellness tracking only and is not medical advice or a clinical diagnosis."
}
"""


def _generate_rule_based_insights(moods: List[models.MoodEntry]) -> schemas.AIInsightsResponse:
    """High-quality offline fallback when external AI APIs are unreachable."""
    if not moods:
        return schemas.AIInsightsResponse(
            summary="You haven't recorded any mood check-ins in this period yet.",
            patterns=["No check-ins available to identify patterns."],
            wellness_suggestions=[
                "Begin by logging your primary mood once daily.",
                "Note context tags like sleep or exercise to spot personal routines.",
                "Take a moment for slow, deep breathing today."
            ],
            disclaimer="NutriLens reflections are for informational wellness tracking and not clinical medical advice.",
            data_points_analyzed=0,
            source="rule_based"
        )

    counts: Dict[str, int] = {}
    intensity_sum = 0
    intensity_count = 0
    tags_all: List[str] = []

    for m in moods:
        counts[m.mood] = counts.get(m.mood, 0) + 1
        if m.intensity is not None:
            intensity_sum += m.intensity
            intensity_count += 1
        tags_all.extend(_deserialize_tags(m.tags))

    top_mood = max(counts.items(), key=lambda x: x[1])[0]
    avg_int = round(intensity_sum / intensity_count, 1) if intensity_count else 3.0

    patterns = [
        f"Your most frequently recorded mood across {len(moods)} entries was '{top_mood}' ({counts[top_mood]} times).",
        f"Your average reported intensity was {avg_int} out of 5."
    ]

    if tags_all:
        top_tag = max(set(tags_all), key=tags_all.count)
        patterns.append(f"Context tag most often associated with your check-ins: #{top_tag}.")

    suggestions = [
        "Maintain consistent sleep and hydration routines to support steady daily energy.",
        "Take brief 5-minute pauses between focused study or work sessions.",
        "Reflect in your journal during transitions between daytime activities and evening rest."
    ]

    if top_mood in ["Stressed", "Anxious", "Frustrated"]:
        suggestions.insert(0, "Consider short grounding exercises, such as a 4-7-8 breathing pause, when feeling elevated tension.")
    elif top_mood in ["Tired"]:
        suggestions.insert(0, "A consistent evening wind-down routine and reduced screen time before bed may help restore vitality.")

    return schemas.AIInsightsResponse(
        summary=f"Over the last recorded period, you completed {len(moods)} check-ins with '{top_mood}' appearing most frequently.",
        patterns=patterns[:3],
        wellness_suggestions=suggestions[:3],
        disclaimer="NutriLens reflections are for personal wellness awareness only and do not constitute clinical diagnosis or treatment.",
        data_points_analyzed=len(moods),
        source="rule_based"
    )


@router.post("/insights", response_model=schemas.AIInsightsResponse)
def generate_ai_insights(
    req: schemas.AIInsightsRequest = schemas.AIInsightsRequest(),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    since = datetime.utcnow() - timedelta(days=req.days or 14)

    moods = (
        db.query(models.MoodEntry)
        .options(joinedload(models.MoodEntry.meal))
        .filter(
            models.MoodEntry.user_id == current_user.id,
            models.MoodEntry.date >= since
        )
        .order_by(models.MoodEntry.date.desc())
        .limit(20)  # Bounded to minimum relevant records
        .all()
    )

    if not moods:
        return _generate_rule_based_insights([])

    # Format minimum relevant context
    summary_lines = []
    for m in moods:
        dt_str = m.date.strftime("%Y-%m-%d") if m.date else "Recent"
        tags = _deserialize_tags(m.tags)
        line = f"- Date: {dt_str}, Mood: {m.mood}, Intensity: {m.intensity or 'N/A'}/5"
        if tags:
            line += f", Tags: {', '.join(tags)}"
        if m.hunger_level:
            line += f", Hunger: {m.hunger_level}"
        if m.cravings:
            line += f", Cravings: {m.cravings}"
        if m.journal_note:
            line += f", Note snippet: {m.journal_note[:100]}"
        summary_lines.append(line)

    user_context = "USER MOOD & WELLNESS RECORDS:\n" + "\n".join(summary_lines)

    # Attempt Gemini reflection
    client = get_gemini_client()
    if client:
        try:
            from google.genai import types
            config = types.GenerateContentConfig(
                system_instruction=AI_INSIGHTS_PROMPT,
                temperature=0.4,
                response_mime_type="application/json",
                http_options=types.HttpOptions(timeout=15000),  # 15s timeout
            )
            for model_name in GEMINI_MODELS:
                try:
                    response = client.models.generate_content(
                        model=model_name,
                        contents=f"Please analyze these user mood check-in records:\n\n{user_context}",
                        config=config
                    )
                    if response and response.text:
                        import json
                        parsed = json.loads(response.text.strip())
                        return schemas.AIInsightsResponse(
                            summary=str(parsed.get("summary", "")).strip() or "Reflection on your recent records.",
                            patterns=[str(p) for p in parsed.get("patterns", []) if p],
                            wellness_suggestions=[str(s) for s in parsed.get("wellness_suggestions", []) if s],
                            disclaimer=str(parsed.get("disclaimer", "NutriLens AI insights are for informational wellness only.")),
                            data_points_analyzed=len(moods),
                            source="gemini"
                        )
                except Exception as model_err:
                    print(f"[Mood Insights Gemini] Model {model_name} failed: {model_err}")
                    continue
        except Exception as e:
            print(f"[Mood Insights Warning]: {e}")

    # Fallback to deterministic rule-based wellness suggestions
    return _generate_rule_based_insights(moods)


# ── 6. Optional Text-Based Emotion Analysis ("Analyze my journal") ────────────
TEXT_ANALYSIS_PROMPT = """You are an objective, supportive text analysis tool.
The user has voluntarily submitted their own private journal entry to receive tentative text sentiment and thematic reflection.

GUIDELINES:
- Identify broad text sentiment and themes (Positive, Neutral, Negative, Stress-related language, Fatigue-related language, Optimism, Calm).
- Map to one tentative suggested mood from: Happy, Calm, Energetic, Neutral, Sad, Stressed, Anxious, Tired, Frustrated.
- Frame all findings as uncertain, tentative text interpretations.
- DO NOT claim to determine the person's true mental health or diagnose any condition.
- DO NOT perform clinical evaluations.

Return valid JSON strictly matching:
{
  "suggested_mood": "Happy | Calm | Energetic | Neutral | Sad | Stressed | Anxious | Tired | Frustrated",
  "confidence_label": "Tentative text observation",
  "emotional_themes": ["Stress-related language", "Work pressure"],
  "sentiment_score": 0.2,
  "explanation": "Brief non-judgmental observation of the language used in the entry.",
  "disclaimer": "This is an uncertain, AI-generated text interpretation based solely on wording. You can freely dismiss it and select your own mood."
}
"""


def _rule_based_text_analysis(text: str) -> schemas.AnalyzeTextResponse:
    """Fast, safe offline sentiment and keyword classifier."""
    lowered = text.lower()

    stress_keywords = ["stress", "overwhelm", "deadline", "pressure", "too much", "hectic", "panic", "behind"]
    anxious_keywords = ["anxious", "worry", "nervous", "scared", "fear", "dread", "uneasy"]
    tired_keywords = ["tired", "exhausted", "sleepy", "drained", "no energy", "fatigue", "weary", "burnt out"]
    sad_keywords = ["sad", "down", "unhappy", "lonely", "crying", "depressed", "hopeless", "grief"]
    frustrated_keywords = ["frustrated", "annoyed", "angry", "irritated", "mad", "upset", "stuck"]
    calm_keywords = ["calm", "peace", "relax", "quiet", "serene", "content", "breathe", "chill"]
    energetic_keywords = ["energetic", "motivated", "pumped", "excited", "productive", "ready", "crushed it"]
    happy_keywords = ["happy", "great", "wonderful", "grateful", "joy", "loved", "smile", "awesome", "good day"]

    scores = {
        "Stressed": sum(1 for k in stress_keywords if k in lowered),
        "Anxious": sum(1 for k in anxious_keywords if k in lowered),
        "Tired": sum(1 for k in tired_keywords if k in lowered),
        "Sad": sum(1 for k in sad_keywords if k in lowered),
        "Frustrated": sum(1 for k in frustrated_keywords if k in lowered),
        "Calm": sum(1 for k in calm_keywords if k in lowered),
        "Energetic": sum(1 for k in energetic_keywords if k in lowered),
        "Happy": sum(1 for k in happy_keywords if k in lowered),
    }

    top_mood = max(scores.items(), key=lambda x: x[1])
    suggested = top_mood[0] if top_mood[1] > 0 else "Neutral"

    themes = []
    if scores["Stressed"] > 0 or scores["Anxious"] > 0:
        themes.append("Tension or pressure language")
    if scores["Tired"] > 0:
        themes.append("Fatigue or rest-seeking language")
    if scores["Sad"] > 0 or scores["Frustrated"] > 0:
        themes.append("Emotional processing language")
    if scores["Calm"] > 0:
        themes.append("Reflective or mindful language")
    if scores["Happy"] > 0 or scores["Energetic"] > 0:
        themes.append("Positive or uplifting language")

    if not themes:
        themes = ["Neutral or observational language"]

    return schemas.AnalyzeTextResponse(
        suggested_mood=suggested,
        confidence_label="Tentative text interpretation",
        emotional_themes=themes,
        sentiment_score=0.1 if suggested in ["Happy", "Calm", "Energetic"] else (-0.2 if suggested != "Neutral" else 0.0),
        explanation=f"Text analysis observed themes relating to {', '.join(themes[:2]).lower()}.",
        disclaimer="This is an uncertain, AI-generated text interpretation based solely on wording. You can freely dismiss it and select your own mood."
    )


@router.post("/analyze-text", response_model=schemas.AnalyzeTextResponse)
def analyze_journal_text(
    req: schemas.AnalyzeTextRequest,
    current_user: models.User = Depends(get_current_user)
):
    if len(req.text.strip()) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Journal text is too short for meaningful analysis"
        )

    client = get_gemini_client()
    if client:
        try:
            from google.genai import types
            config = types.GenerateContentConfig(
                system_instruction=TEXT_ANALYSIS_PROMPT,
                temperature=0.3,
                response_mime_type="application/json",
                http_options=types.HttpOptions(timeout=12000),
            )
            for model_name in GEMINI_MODELS:
                try:
                    response = client.models.generate_content(
                        model=model_name,
                        contents=f"Analyze this journal entry text:\n\n{req.text.strip()[:1500]}",
                        config=config
                    )
                    if response and response.text:
                        import json
                        data = json.loads(response.text.strip())
                        suggested = _normalize_mood(str(data.get("suggested_mood", "Neutral")))
                        return schemas.AnalyzeTextResponse(
                            suggested_mood=suggested,
                            confidence_label=str(data.get("confidence_label", "Tentative text observation")),
                            emotional_themes=[str(t) for t in data.get("emotional_themes", []) if t],
                            sentiment_score=float(data.get("sentiment_score", 0.0)) if data.get("sentiment_score") is not None else None,
                            explanation=str(data.get("explanation", "Language patterns in journal entry observed.")),
                            disclaimer=str(data.get("disclaimer", "Uncertain text interpretation. You remain in complete control of your chosen mood."))
                        )
                except Exception as me:
                    print(f"[Analyze Text Gemini] Model {model_name} failed: {me}")
                    continue
        except Exception as e:
            print(f"[Analyze Text Warning]: {e}")

    # Offline fallback
    return _rule_based_text_analysis(req.text)


# ── 7. Retrieve Single Owned Mood Entry ───────────────────────────────────────
@router.get("/{entry_id}", response_model=schemas.MoodEntryOut)
def get_mood_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    entry = (
        db.query(models.MoodEntry)
        .options(joinedload(models.MoodEntry.meal))
        .filter(
            models.MoodEntry.id == entry_id,
            models.MoodEntry.user_id == current_user.id
        )
        .first()
    )
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mood entry #{entry_id} not found"
        )
    return _format_entry_out(entry)


# ── 8. Update Owned Mood Entry (PATCH & PUT) ──────────────────────────────────
@router.patch("/{entry_id}", response_model=schemas.MoodEntryOut)
@router.put("/{entry_id}", response_model=schemas.MoodEntryOut)
def update_mood_entry(
    entry_id: int,
    entry_in: schemas.MoodEntryUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    entry = (
        db.query(models.MoodEntry)
        .filter(
            models.MoodEntry.id == entry_id,
            models.MoodEntry.user_id == current_user.id
        )
        .first()
    )
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mood entry #{entry_id} not found"
        )

    if entry_in.mood is not None:
        entry.mood = _normalize_mood(entry_in.mood)

    if entry_in.intensity is not None:
        if not (1 <= entry_in.intensity <= 5):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mood intensity must be between 1 and 5"
            )
        entry.intensity = entry_in.intensity

    if entry_in.duration is not None:
        entry.duration = entry_in.duration

    if entry_in.tags is not None:
        entry.tags = _serialize_tags(entry_in.tags)

    if entry_in.journal_note is not None:
        if len(entry_in.journal_note) > 3000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Journal note exceeds maximum limit of 3000 characters"
            )
        entry.journal_note = entry_in.journal_note.strip() if entry_in.journal_note else None

    if entry_in.meal_id is not None:
        if entry_in.meal_id == 0:
            entry.meal_id = None
        else:
            meal = db.query(models.Meal).filter(
                models.Meal.id == entry_in.meal_id,
                models.Meal.user_id == current_user.id
            ).first()
            if not meal:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Referenced meal not found in your meal logs"
                )
            entry.meal_id = meal.id

    if entry_in.hunger_level is not None:
        entry.hunger_level = entry_in.hunger_level

    if entry_in.cravings is not None:
        entry.cravings = entry_in.cravings

    if entry_in.water_intake is not None:
        entry.water_intake = entry_in.water_intake

    if entry_in.sleep_hours is not None:
        entry.sleep_hours = entry_in.sleep_hours

    if entry_in.date is not None:
        if isinstance(entry_in.date, datetime):
            entry.date = entry_in.date
        elif isinstance(entry_in.date, str):
            try:
                entry.date = datetime.fromisoformat(entry_in.date.replace("Z", "+00:00"))
            except ValueError:
                pass

    entry.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(entry)
    return _format_entry_out(entry)


# ── 9. Delete Owned Mood Entry ────────────────────────────────────────────────
@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_mood_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    entry = (
        db.query(models.MoodEntry)
        .filter(
            models.MoodEntry.id == entry_id,
            models.MoodEntry.user_id == current_user.id
        )
        .first()
    )
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mood entry #{entry_id} not found"
        )

    db.delete(entry)
    db.commit()
    return None
