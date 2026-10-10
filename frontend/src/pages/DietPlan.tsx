// src/pages/DietPlan.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  Sparkles,
  RefreshCw,
  Flame,
  CheckCircle2,
  Clock,
  Coffee,
  Sun,
  Sunset,
  Moon,
  Apple,
  PencilLine,
  PlusCircle,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Target,
  Droplet,
  Calendar,
} from 'lucide-react';

interface FoodItem {
  food_name: string;
  serving_size?: string;
  quantity: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

interface MealPlanItem {
  meal_type: string;
  items: FoodItem[];
  estimated_calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  time?: string;
  ai_recommended?: boolean;
}

const mealIcons: Record<string, React.ElementType> = {
  'Breakfast': Coffee,
  'Morning Snack': Apple,
  'Lunch': Sun,
  'Evening Snack': Sunset,
  'Dinner': Moon,
};

const emptyMeal = (): MealPlanItem => ({
  meal_type: '',
  items: [{ food_name: '', serving_size: '', quantity: 1, calories: 150, protein: 10, carbs: 15, fat: 4 }],
  estimated_calories: 0,
});

const defaultTimeline = [
  {
    meal_type: 'Breakfast',
    time: '8:00 AM',
    estimated_calories: 420,
    protein: 26,
    carbs: 48,
    fat: 12,
    ai_recommended: true,
    items: [
      { food_name: 'Oatmeal with Blueberries & Almonds', serving_size: '1 bowl (250g)', quantity: 1, calories: 320, protein: 12, carbs: 48, fat: 8 },
      { food_name: 'Boiled Egg Whites', serving_size: '2 whites', quantity: 2, calories: 100, protein: 14, carbs: 0, fat: 4 },
    ],
  },
  {
    meal_type: 'Morning Snack',
    time: '11:00 AM',
    estimated_calories: 190,
    protein: 15,
    carbs: 18,
    fat: 4,
    ai_recommended: true,
    items: [
      { food_name: 'Greek Yogurt with Chia Seeds & Honey', serving_size: '150g', quantity: 1, calories: 190, protein: 15, carbs: 18, fat: 4 },
    ],
  },
  {
    meal_type: 'Lunch',
    time: '1:30 PM',
    estimated_calories: 620,
    protein: 44,
    carbs: 58,
    fat: 16,
    ai_recommended: true,
    items: [
      { food_name: 'Grilled Chicken Breast & Quinoa Bowl', serving_size: '350g bowl', quantity: 1, calories: 480, protein: 38, carbs: 46, fat: 12 },
      { food_name: 'Steamed Broccoli & Mixed Greens', serving_size: '100g', quantity: 1, calories: 140, protein: 6, carbs: 12, fat: 4 },
    ],
  },
  {
    meal_type: 'Evening Snack',
    time: '5:00 PM',
    estimated_calories: 180,
    protein: 8,
    carbs: 24,
    fat: 5,
    ai_recommended: true,
    items: [
      { food_name: 'Crisp Green Apple with Almond Butter', serving_size: '1 apple + 1 tbsp', quantity: 1, calories: 180, protein: 8, carbs: 24, fat: 5 },
    ],
  },
  {
    meal_type: 'Dinner',
    time: '8:00 PM',
    estimated_calories: 540,
    protein: 38,
    carbs: 42,
    fat: 18,
    ai_recommended: true,
    items: [
      { food_name: 'Steamed Wild Salmon Fillet', serving_size: '180g fillet', quantity: 1, calories: 340, protein: 32, carbs: 0, fat: 14 },
      { food_name: 'Roasted Sweet Potato & Asparagus', serving_size: '150g', quantity: 1, calories: 200, protein: 6, carbs: 42, fat: 4 },
    ],
  },
];

const DietPlan: React.FC = () => {
  const navigate = useNavigate();
  const [scheduleView, setScheduleView] = useState<'today' | 'tomorrow' | 'week'>('today');
  const [mode, setMode] = useState<'view' | 'edit' | 'custom'>('view');
  const [plan, setPlan] = useState<MealPlanItem[] | null>(defaultTimeline);
  const [draft, setDraft] = useState<MealPlanItem[]>(defaultTimeline);
  const [customPlan, setCustomPlan] = useState<MealPlanItem[]>([emptyMeal()]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [activeDetailMeal, setActiveDetailMeal] = useState<MealPlanItem | null>(null);

  const fallbackPlan = (): MealPlanItem[] => defaultTimeline;

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await api.post('/diet-plan/generate');
      const data: MealPlanItem[] = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.plan)
        ? res.data.plan
        : fallbackPlan();

      const enriched = data.map((m, i) => ({
        ...m,
        time: defaultTimeline[i % defaultTimeline.length]?.time || '12:00 PM',
        protein: m.protein || Math.round((m.estimated_calories || 400) * 0.06),
        carbs: m.carbs || Math.round((m.estimated_calories || 400) * 0.1),
        fat: m.fat || Math.round((m.estimated_calories || 400) * 0.025),
        ai_recommended: true,
      }));

      setPlan(enriched);
      setDraft(JSON.parse(JSON.stringify(enriched)));
    } catch {
      const fb = fallbackPlan();
      setPlan(fb);
      setDraft(JSON.parse(JSON.stringify(fb)));
    } finally {
      setLoading(false);
    }
  };

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleExpand = (i: number) => setExpanded((e) => ({ ...e, [i]: !e[i] }));
  const totalCal = (meals: MealPlanItem[]) => meals.reduce((s, m) => s + (m.estimated_calories || 0), 0);
  const totalProtein = (meals: MealPlanItem[]) => meals.reduce((s, m) => s + (m.protein || 30), 0);

  // Draft editing helpers
  const setDraftMeal = (mi: number, key: keyof MealPlanItem, val: any) =>
    setDraft((d) => d.map((m, i) => (i === mi ? { ...m, [key]: val } : m)));

  const setDraftItem = (mi: number, ii: number, key: keyof FoodItem, val: any) =>
    setDraft((d) =>
      d.map((m, i) =>
        i !== mi ? m : { ...m, items: m.items.map((it, j) => (j === ii ? { ...it, [key]: val } : it)) }
      )
    );

  const addDraftItem = (mi: number) =>
    setDraft((d) =>
      d.map((m, i) =>
        i !== mi
          ? m
          : { ...m, items: [...m.items, { food_name: '', serving_size: '', quantity: 1, calories: 120, protein: 8, carbs: 14, fat: 3 }] }
      )
    );

  const removeDraftItem = (mi: number, ii: number) =>
    setDraft((d) =>
      d.map((m, i) => (i !== mi ? m : { ...m, items: m.items.filter((_, j) => j !== ii) }))
    );

  const saveDraft = () => {
    setPlan(JSON.parse(JSON.stringify(draft)));
    setMode('view');
    flashSaved();
  };

  // Custom plan helpers
  const setCustomMeal = (mi: number, key: keyof MealPlanItem, val: any) =>
    setCustomPlan((d) => d.map((m, i) => (i === mi ? { ...m, [key]: val } : m)));

  const setCustomItem = (mi: number, ii: number, key: keyof FoodItem, val: any) =>
    setCustomPlan((d) =>
      d.map((m, i) =>
        i !== mi ? m : { ...m, items: m.items.map((it, j) => (j === ii ? { ...it, [key]: val } : it)) }
      )
    );

  const addCustomItem = (mi: number) =>
    setCustomPlan((d) =>
      d.map((m, i) =>
        i !== mi
          ? m
          : { ...m, items: [...m.items, { food_name: '', serving_size: '', quantity: 1, calories: 150, protein: 10, carbs: 18, fat: 4 }] }
      )
    );

  const removeCustomItem = (mi: number, ii: number) =>
    setCustomPlan((d) =>
      d.map((m, i) => (i !== mi ? m : { ...m, items: m.items.filter((_, j) => j !== ii) }))
    );

  const addCustomMeal = () => setCustomPlan((d) => [...d, emptyMeal()]);
  const removeCustomMeal = (mi: number) => setCustomPlan((d) => d.filter((_, i) => i !== mi));

  const saveCustomPlan = () => {
    setPlan(JSON.parse(JSON.stringify(customPlan)));
    setMode('view');
    flashSaved();
  };

  const currentTimeline = plan || defaultTimeline;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* ━━━ 1. Personalized Diet Plan Header Card ━━━ */}
      <div className="premium-card p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-200/80">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>NutriLens Intelligent Planning</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Your Personalized Diet Plan
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium max-w-xl">
              Engineered macro-caloric balance tailored for optimal metabolism, muscle recovery, and continuous daily energy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={generatePlan}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Menu...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Plan</span>
                </>
              )}
            </button>

            {plan && mode === 'view' && (
              <button
                onClick={() => {
                  setDraft(JSON.parse(JSON.stringify(plan)));
                  setMode('edit');
                }}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#faf9f8] text-neutral-700 border border-neutral-200 font-semibold text-xs transition-all flex items-center gap-2 shadow-2xs"
              >
                <PencilLine className="w-4 h-4 text-emerald-600" />
                <span>Edit Schedule</span>
              </button>
            )}

            <button
              onClick={() => setMode('custom')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#faf9f8] text-neutral-700 border border-neutral-200 font-semibold text-xs transition-all flex items-center gap-2 shadow-2xs"
            >
              <PlusCircle className="w-4 h-4 text-neutral-500" />
              <span>Build Custom</span>
            </button>
          </div>
        </div>

        {/* Target Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-[#faf9f8] border border-neutral-200/60">
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Target className="w-3.5 h-3.5 text-indigo-500" />
              <span>Goal</span>
            </div>
            <div className="text-base font-bold text-neutral-900 truncate">Lean Muscle & Health</div>
            <span className="text-[11px] text-neutral-400 font-medium">BMR optimized</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf9f8] border border-neutral-200/60">
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Calorie Target</span>
            </div>
            <div className="text-base font-bold text-neutral-900">
              {totalCal(currentTimeline).toLocaleString()}{' '}
              <span className="text-xs font-normal text-neutral-400">kcal/day</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">100% Target Met</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf9f8] border border-neutral-200/60">
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Protein Target</span>
            </div>
            <div className="text-base font-bold text-neutral-900">
              {totalProtein(currentTimeline)}{' '}
              <span className="text-xs font-normal text-neutral-400">g/day</span>
            </div>
            <span className="text-[11px] text-neutral-400 font-medium">~1.8g / kg target</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf9f8] border border-neutral-200/60">
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Droplet className="w-3.5 h-3.5 text-cyan-500" />
              <span>Water Target</span>
            </div>
            <div className="text-base font-bold text-neutral-900">
              2,000 <span className="text-xs font-normal text-neutral-400">ml</span>
            </div>
            <span className="text-[11px] text-neutral-400 font-medium">8 full glasses</span>
          </div>
        </div>

        {/* Schedule Filter Tabs: Today / Tomorrow / This Week */}
        <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 border border-neutral-200/70">
            <button
              onClick={() => setScheduleView('today')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scheduleView === 'today'
                  ? 'bg-white text-neutral-900 shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Today's Plan
            </button>
            <button
              onClick={() => setScheduleView('tomorrow')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scheduleView === 'tomorrow'
                  ? 'bg-white text-neutral-900 shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Tomorrow
            </button>
            <button
              onClick={() => setScheduleView('week')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                scheduleView === 'week'
                  ? 'bg-white text-neutral-900 shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              This Week
            </button>
          </div>

          {saved && (
            <span className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Diet Plan Saved Successfully!
            </span>
          )}
        </div>
      </div>

      {/* ━━━ 2. MEAL TIMELINE (VIEW MODE) ━━━ */}
      {mode === 'view' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              {scheduleView === 'today' ? 'Today’s Meal Timeline' : scheduleView === 'tomorrow' ? 'Tomorrow’s Meal Schedule' : '7-Day Rotation Overview'}
            </h3>
            <span className="text-xs text-neutral-400 font-medium">
              {currentTimeline.length} balanced intervals
            </span>
          </div>

          {currentTimeline.map((meal, idx) => {
            const MealIcon = mealIcons[meal.meal_type] || Coffee;
            const primaryFood = meal.items[0]?.food_name || 'Nutritious Meal';

            return (
              <div
                key={idx}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* Left Side: Meal Info & Food List */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/80">
                    <MealIcon className="w-6 h-6" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        {meal.meal_type}
                      </span>
                      {meal.time && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          {meal.time}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        AI Recommended
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-neutral-900">
                      {primaryFood}
                    </h3>

                    <ul className="space-y-1 pt-1">
                      {meal.items.map((item, i) => (
                        <li key={i} className="text-xs text-neutral-600 flex items-center gap-2 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>
                            <strong className="text-neutral-800">{item.food_name}</strong>
                            {item.serving_size ? ` (${item.serving_size})` : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Side: Macro Breakdown & Action Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                  {/* Macros strip */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-base font-black text-neutral-900 flex items-center gap-1 justify-end">
                        <Flame className="w-4 h-4 text-amber-500" />
                        {meal.estimated_calories || 380} kcal
                      </div>
                      <span className="text-[11px] text-neutral-400 font-medium">Portion Energy</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200/60">
                        P: {meal.protein || 24}g
                      </span>
                      <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60">
                        C: {meal.carbs || 36}g
                      </span>
                      <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-700 font-bold border border-amber-200/60">
                        F: {meal.fat || 10}g
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveDetailMeal(meal)}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#faf9f8] text-neutral-700 border border-neutral-200 text-xs font-semibold transition-colors shadow-2xs"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setDraft(JSON.parse(JSON.stringify(currentTimeline)));
                        setMode('edit');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#faf9f8] hover:bg-neutral-100 text-neutral-700 text-xs font-semibold transition-colors"
                    >
                      Replace Meal
                    </button>
                    <button
                      onClick={() => navigate('/add-meal')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-2xs"
                    >
                      Log Meal
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ━━━ 3. EDIT AI PLAN MODE ━━━ */}
      {mode === 'edit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-neutral-500 font-medium">
              Adjust meal designations, ingredient portions or calorie allocations then save.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setMode('view')}
                className="px-3.5 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-[#faf9f8] text-xs font-semibold flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
              <button
                onClick={saveDraft}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </div>

          {draft.map((meal, mi) => (
            <div key={mi} className="premium-card overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-neutral-100 bg-[#faf9f8]">
                <input
                  value={meal.meal_type}
                  onChange={(e) => setDraftMeal(mi, 'meal_type', e.target.value)}
                  placeholder="Meal label"
                  className="flex-1 text-sm font-bold text-neutral-900 bg-transparent border-b border-dashed border-neutral-300 focus:outline-none focus:border-emerald-500 pb-0.5"
                />
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 shrink-0">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <input
                    type="number"
                    min={0}
                    value={meal.estimated_calories ?? ''}
                    onChange={(e) => setDraftMeal(mi, 'estimated_calories', Number(e.target.value))}
                    className="w-16 text-right bg-transparent border-b border-dashed border-neutral-300 focus:outline-none focus:border-emerald-500"
                  />
                  <span>kcal</span>
                </div>
                <button onClick={() => toggleExpand(mi)} className="text-neutral-400 hover:text-neutral-600 ml-1">
                  {expanded[mi] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {!expanded[mi] && (
                <div className="p-4 space-y-2">
                  {meal.items.map((item, ii) => (
                    <div key={ii} className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
                      <input
                        value={item.food_name}
                        onChange={(e) => setDraftItem(mi, ii, 'food_name', e.target.value)}
                        placeholder="Food item name"
                        className="flex-1 min-w-0 text-xs text-neutral-800 border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 font-medium"
                      />
                      <input
                        value={item.serving_size ?? ''}
                        onChange={(e) => setDraftItem(mi, ii, 'serving_size', e.target.value)}
                        placeholder="Serving portion"
                        className="w-36 text-xs text-neutral-800 border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 font-medium"
                      />
                      <button
                        onClick={() => removeDraftItem(mi, ii)}
                        className="p-2 rounded-xl hover:bg-rose-50 text-neutral-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addDraftItem(mi)}
                    className="mt-1 flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 text-xs font-semibold"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Add food ingredient
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setMode('view')}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-[#faf9f8] text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={saveDraft}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs"
            >
              Save Diet Schedule
            </button>
          </div>
        </div>
      )}

      {/* ━━━ 4. BUILD CUSTOM PLAN MODE ━━━ */}
      {mode === 'custom' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-neutral-500 font-medium">
              Construct a custom nutrition program from scratch with custom meal slots.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setMode('view')}
                className="px-3.5 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-[#faf9f8] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={saveCustomPlan}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs"
              >
                Save as Active Plan
              </button>
            </div>
          </div>

          {customPlan.map((meal, mi) => (
            <div key={mi} className="premium-card overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-neutral-100 bg-[#faf9f8]">
                <input
                  value={meal.meal_type}
                  onChange={(e) => setCustomMeal(mi, 'meal_type', e.target.value)}
                  placeholder="Meal label (e.g. Post-Workout Shake)"
                  className="flex-1 text-sm font-bold text-neutral-900 bg-transparent border-b border-dashed border-neutral-300 focus:outline-none focus:border-emerald-500 pb-0.5"
                />
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 shrink-0">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <input
                    type="number"
                    min={0}
                    value={meal.estimated_calories ?? ''}
                    onChange={(e) => setCustomMeal(mi, 'estimated_calories', Number(e.target.value))}
                    placeholder="0"
                    className="w-16 text-right bg-transparent border-b border-dashed border-neutral-300 focus:outline-none focus:border-emerald-500"
                  />
                  <span>kcal</span>
                </div>
                <button
                  onClick={() => removeCustomMeal(mi)}
                  className="ml-1 p-1.5 rounded-lg hover:bg-rose-50 text-neutral-400 hover:text-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-2">
                {meal.items.map((item, ii) => (
                  <div key={ii} className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
                    <input
                      value={item.food_name}
                      onChange={(e) => setCustomItem(mi, ii, 'food_name', e.target.value)}
                      placeholder="Food ingredient"
                      className="flex-1 min-w-0 text-xs text-neutral-800 border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                    <input
                      value={item.serving_size ?? ''}
                      onChange={(e) => setCustomItem(mi, ii, 'serving_size', e.target.value)}
                      placeholder="Serving size (e.g. 150g)"
                      className="w-36 text-xs text-neutral-800 border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                    <button
                      onClick={() => removeCustomItem(mi, ii)}
                      className="p-2 rounded-xl hover:bg-rose-50 text-neutral-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addCustomItem(mi)}
                  className="mt-1 flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 text-xs font-semibold"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add food item
                </button>
              </div>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            <button
              onClick={addCustomMeal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-emerald-400 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition-colors w-full sm:w-auto justify-center"
            >
              <PlusCircle className="w-4 h-4" />
              Add Another Meal
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
              <Flame className="w-4 h-4 text-amber-500" />
              Total Energy: <span className="text-emerald-700">{totalCal(customPlan)} kcal</span> / day
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setMode('view')}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-[#faf9f8] text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={saveCustomPlan}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs"
            >
              Save Custom Program
            </button>
          </div>
        </div>
      )}

      {/* ━━━ 5. Detail Modal for View Details ━━━ */}
      {activeDetailMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-lg w-full p-6 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Coffee className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">{activeDetailMeal.meal_type} Details</h3>
                  <span className="text-xs text-neutral-400 font-medium">Scheduled for {activeDetailMeal.time || 'Meal Time'}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveDetailMeal(null)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf9f8] border border-neutral-200/60 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Estimated Energy</span>
                <span className="text-xl font-black text-neutral-900">{activeDetailMeal.estimated_calories} kcal</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-200/60 text-center">
                <div className="p-2 rounded-xl bg-white border border-neutral-200/60">
                  <span className="text-[10px] text-neutral-400 font-bold block uppercase">Protein</span>
                  <span className="text-sm font-extrabold text-blue-700">{activeDetailMeal.protein || 24}g</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-neutral-200/60">
                  <span className="text-[10px] text-neutral-400 font-bold block uppercase">Carbs</span>
                  <span className="text-sm font-extrabold text-emerald-700">{activeDetailMeal.carbs || 38}g</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-neutral-200/60">
                  <span className="text-[10px] text-neutral-400 font-bold block uppercase">Fats</span>
                  <span className="text-sm font-extrabold text-amber-700">{activeDetailMeal.fat || 10}g</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Ingredients & Portions</h4>
              <ul className="space-y-1.5 divide-y divide-neutral-100">
                {activeDetailMeal.items.map((item, idx) => (
                  <li key={idx} className="pt-2 flex items-center justify-between text-xs font-medium text-neutral-700">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <strong>{item.food_name}</strong>
                    </span>
                    <span className="text-neutral-400">{item.serving_size || '1 serving'}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
              <button
                onClick={() => setActiveDetailMeal(null)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-[#faf9f8] text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setActiveDetailMeal(null);
                  navigate('/add-meal');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs"
              >
                Log to Today's Meals
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietPlan;
