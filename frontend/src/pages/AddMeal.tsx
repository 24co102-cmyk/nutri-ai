// src/pages/AddMeal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  Search,
  PlusCircle,
  Check,
  Flame,
  X,
  Camera,
  Barcode,
  History,
  Edit3,
  CheckCircle2,
} from 'lucide-react';
import { ProgressRing } from '../components/ui/ProgressRing';

interface Food {
  id: number;
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  sugar?: number;
  fiber?: number;
  sodium?: number;
  serving_size?: string;
}

const RECENT_FOOD_PRESETS: Food[] = [
  { id: 901, name: 'Rolled Oats with Berries & Almonds', calories: 150, protein: 5, carbs: 27, fat: 3, fiber: 4, sugar: 3, sodium: 5, serving_size: '100g' },
  { id: 902, name: 'Grilled Chicken Breast Bowl', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74, serving_size: '100g' },
  { id: 903, name: 'Plain Greek Yogurt (0% Fat)', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, sugar: 3.2, sodium: 36, serving_size: '100g' },
  { id: 904, name: 'Hard Boiled Organic Eggs', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1, sodium: 124, serving_size: '100g' },
  { id: 905, name: 'Steamed Wild Atlantic Salmon', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0, sodium: 59, serving_size: '100g' },
  { id: 906, name: 'Brown Rice & Steamed Veggies', calories: 112, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, sugar: 0.3, sodium: 5, serving_size: '100g' },
];

const PORTION_CHIPS = [50, 100, 150, 200, 250, 300];

const AddMeal: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'search' | 'recent' | 'manual'>('search');
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(RECENT_FOOD_PRESETS[1]); // Default to Chicken Breast
  const [quantity, setQuantity] = useState<number>(150); // 150g
  const [mealType, setMealType] = useState('Lunch');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 16));
  const [mealMood, setMealMood] = useState<string>('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  // Manual nutrition inputs
  const [manualForm, setManualForm] = useState({
    name: '',
    calories: 220,
    protein: 18,
    carbs: 24,
    fat: 6,
    sugar: 2,
    fiber: 3,
    sodium: 180,
    serving_size: '1 serving',
  });

  // Search foods when query changes with cancellation of obsolete requests
  useEffect(() => {
    const controller = new AbortController();
    const fetchFoods = async () => {
      if (!query.trim()) {
        setFoods([]);
        return;
      }
      setLoadingSearch(true);
      try {
        const res = await api.get(`/foods/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        setFoods(res.data || []);
      } catch (e: any) {
        if (e?.name !== 'CanceledError' && e?.code !== 'ERR_CANCELED') {
          console.error(e);
        }
      } finally {
        setLoadingSearch(false);
      }
    };

    const timer = setTimeout(fetchFoods, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Compute live macro calculations (memoized to eliminate redundant computations on keystroke)
  const factor = (quantity || 0) / 100;
  const currentBase = useMemo(() => {
    return activeTab === 'manual'
      ? {
          name: manualForm.name || 'Custom Meal',
          calories: manualForm.calories,
          protein: manualForm.protein,
          carbs: manualForm.carbs,
          fat: manualForm.fat,
          sugar: manualForm.sugar,
          fiber: manualForm.fiber,
          sodium: manualForm.sodium,
        }
      : selectedFood || RECENT_FOOD_PRESETS[0];
  }, [activeTab, manualForm, selectedFood]);

  const { calcCalories, calcProtein, calcCarbs, calcFat, calcFiber, calcSodium } = useMemo(() => ({
    calcCalories: Math.round((currentBase.calories || 160) * factor),
    calcProtein: Math.round((currentBase.protein || 12) * factor),
    calcCarbs: Math.round((currentBase.carbs || 20) * factor),
    calcFat: Math.round((currentBase.fat || 5) * factor),
    calcFiber: Math.round((currentBase.fiber || 2) * factor),
    calcSodium: Math.round((currentBase.sodium || 60) * factor),
  }), [currentBase, factor]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'manual' && !manualForm.name.trim()) {
      alert('Please enter a meal name for manual logging');
      return;
    }
    if (activeTab !== 'manual' && !selectedFood) {
      alert('Please select a food item to log');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        meal_type: mealType,
        date: date,
        mood: mealMood || undefined,
        items: [
          {
            food_id: activeTab === 'manual' ? 1 : selectedFood?.id || 1,
            food_name: activeTab === 'manual' ? manualForm.name : selectedFood?.name,
            quantity: quantity,
            calories: calcCalories,
            protein: calcProtein,
            carbs: calcCarbs,
            fat: calcFat,
          },
        ],
      };
      await api.post('/meals/', payload);
      setSuccessNotice(true);
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (e) {
      console.error(e);
      alert('Failed to log meal entry. Please verify connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* ━━━ Header ━━━ */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-200/80">
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Nutrition Registry</span>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Log Your Meal
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">
            Search our comprehensive food database, scan product barcodes, or record custom nutritional entries.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-3.5 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-[#faf9f8] text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
        >
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>

      {/* ━━━ Top Options Bar (Search Food / Photo Scan / Barcode / Recent / Manual) ━━━ */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <button
          onClick={() => setActiveTab('search')}
          className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 text-center ${
            activeTab === 'search'
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
              : 'bg-white border-neutral-200/80 text-neutral-700 hover:border-emerald-300'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Search Food</span>
        </button>

        <button
          onClick={() => navigate('/scan/photo')}
          className="p-3 rounded-2xl border bg-white border-neutral-200/80 text-neutral-700 hover:border-cyan-400 hover:bg-cyan-50/50 text-xs font-bold transition-all flex flex-col items-center gap-1.5 text-center"
        >
          <Camera className="w-4 h-4 text-cyan-600" />
          <span>Upload Photo</span>
        </button>

        <button
          onClick={() => navigate('/scan/barcode')}
          className="p-3 rounded-2xl border bg-white border-neutral-200/80 text-neutral-700 hover:border-teal-400 hover:bg-teal-50/50 text-xs font-bold transition-all flex flex-col items-center gap-1.5 text-center"
        >
          <Barcode className="w-4 h-4 text-teal-600" />
          <span>Scan Barcode</span>
        </button>

        <button
          onClick={() => setActiveTab('recent')}
          className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 text-center ${
            activeTab === 'recent'
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
              : 'bg-white border-neutral-200/80 text-neutral-700 hover:border-emerald-300'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Choose Recent</span>
        </button>

        <button
          onClick={() => setActiveTab('manual')}
          className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 text-center ${
            activeTab === 'manual'
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
              : 'bg-white border-neutral-200/80 text-neutral-700 hover:border-emerald-300'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Manual Entry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ━━━ LEFT COLUMN: Input Mode Area (7 cols) ━━━ */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: SEARCH FOOD */}
          {activeTab === 'search' && (
            <div className="premium-card p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                  1. Search Food Database
                </h3>
                <span className="text-xs text-neutral-400 font-medium">8,000+ Verified Foods</span>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search food database (e.g. Oats, Grilled Chicken, Apple, Rice)..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-medium"
                />
              </div>

              {loadingSearch && (
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                  <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <span>Searching nutrition indices...</span>
                </div>
              )}

              {/* Search Results List */}
              {foods.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {foods.map((food) => {
                    const isSelected = selectedFood?.id === food.id;
                    return (
                      <div
                        key={food.id}
                        onClick={() => setSelectedFood(food)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50/90 border-emerald-500 shadow-2xs'
                            : 'bg-white border-neutral-200/80 hover:border-neutral-300 hover:bg-[#faf9f8]'
                        }`}
                      >
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-900">{food.name}</h4>
                          <p className="text-[11px] text-neutral-400 mt-0.5 font-medium">
                            {food.calories || 120} kcal per 100g • {food.serving_size || 'Standard portion'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-bold text-neutral-700">{food.calories || 120} kcal</span>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                !loadingSearch && (
                  <div className="p-4 rounded-2xl bg-[#faf9f8] border border-neutral-200/60 text-xs text-neutral-500 font-medium">
                    {query ? (
                      <p>No direct matches found for "{query}". You can select from Recent Foods or use Manual Entry below.</p>
                    ) : (
                      <p>Type any ingredient or dish above to browse calories and macronutrient densities.</p>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {/* TAB 2: RECENT FOODS */}
          {activeTab === 'recent' && (
            <div className="premium-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                  Frequent & Popular Foods
                </h3>
                <span className="text-xs text-neutral-400 font-medium">Quick Pick</span>
              </div>

              <div className="space-y-2">
                {RECENT_FOOD_PRESETS.map((food) => {
                  const isSelected = selectedFood?.id === food.id;
                  return (
                    <div
                      key={food.id}
                      onClick={() => setSelectedFood(food)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-50/90 border-emerald-500 shadow-2xs'
                          : 'bg-white border-neutral-200/80 hover:border-neutral-300 hover:bg-[#faf9f8]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold text-xs">
                          {food.name[0]}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-900">{food.name}</h4>
                          <p className="text-[11px] text-neutral-400 font-medium">
                            {food.calories} kcal • P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: MANUAL ENTRY */}
          {activeTab === 'manual' && (
            <div className="premium-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                  Manual Nutrition Input
                </h3>
                <span className="text-xs text-neutral-400 font-medium">Custom Entry</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Food / Dish Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Homemade Tofu Stir-Fry"
                    value={manualForm.name}
                    onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:outline-none font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Calories (kcal)
                    </label>
                    <input
                      type="number"
                      value={manualForm.calories}
                      onChange={(e) => setManualForm({ ...manualForm, calories: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      value={manualForm.protein}
                      onChange={(e) => setManualForm({ ...manualForm, protein: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 font-bold text-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      value={manualForm.carbs}
                      onChange={(e) => setManualForm({ ...manualForm, carbs: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 font-bold text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Fat (g)
                    </label>
                    <input
                      type="number"
                      value={manualForm.fat}
                      onChange={(e) => setManualForm({ ...manualForm, fat: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 font-bold text-amber-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Sugar (g)
                    </label>
                    <input
                      type="number"
                      value={manualForm.sugar}
                      onChange={(e) => setManualForm({ ...manualForm, sugar: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Fiber (g)
                    </label>
                    <input
                      type="number"
                      value={manualForm.fiber}
                      onChange={(e) => setManualForm({ ...manualForm, fiber: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Sodium (mg)
                    </label>
                    <input
                      type="number"
                      value={manualForm.sodium}
                      onChange={(e) => setManualForm({ ...manualForm, sodium: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Serving Size
                    </label>
                    <input
                      type="text"
                      value={manualForm.serving_size}
                      onChange={(e) => setManualForm({ ...manualForm, serving_size: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Portion & Meal Schedule Settings */}
          <div className="premium-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              2. Portion & Meal Details
            </h3>

            {/* Serving Quantity with preset chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-700">Portion Weight / Grams</span>
                <span className="font-bold text-emerald-700">{quantity} grams</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="flex-1 accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {PORTION_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setQuantity(chip)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                      quantity === chip
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {chip}g
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Type & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-neutral-100">
              <div>
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Meal Category
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 font-semibold"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Morning Snack">Morning Snack</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Evening Snack">Evening Snack</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Timestamp
                </label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            {/* Associate Current Mood (Optional) */}
            <div className="pt-3 border-t border-neutral-100">
              <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                Associate with Current Mood (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Happy', emoji: '😊' },
                  { label: 'Calm', emoji: '😌' },
                  { label: 'Energetic', emoji: '⚡' },
                  { label: 'Neutral', emoji: '😐' },
                  { label: 'Sad', emoji: '😢' },
                  { label: 'Stressed', emoji: '😫' },
                  { label: 'Anxious', emoji: '😰' },
                  { label: 'Tired', emoji: '🥱' },
                  { label: 'Frustrated', emoji: '😤' },
                ].map((m) => (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => setMealMood(mealMood === m.label ? '' : m.label)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                      mealMood === m.label
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-[#faf9f8] text-neutral-700 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
                {mealMood && (
                  <button
                    type="button"
                    onClick={() => setMealMood('')}
                    className="px-2 py-1.5 text-xs text-neutral-400 hover:text-neutral-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ━━━ RIGHT COLUMN: Live Nutrition Preview (5 cols) ━━━ */}
        <div className="lg:col-span-5 space-y-6">
          <div className="premium-card p-6 space-y-5 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Live Preview
                </span>
                <h3 className="text-base font-extrabold text-neutral-900 truncate max-w-[200px]">
                  {currentBase.name || 'Select a Food'}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                {mealType}
              </span>
            </div>

            {/* Big Calorie Ring & Total Calculation */}
            <div className="flex items-center gap-5 p-4 rounded-2xl bg-[#faf9f8] border border-neutral-200/60">
              <ProgressRing
                progress={Math.min(100, Math.round((calcCalories / 600) * 100))}
                size={85}
                strokeWidth={7}
                color="#059669"
                trackColor="#e2e8f0"
              >
                <Flame className="w-5 h-5 text-amber-500" />
              </ProgressRing>

              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  Total Energy
                </span>
                <div className="text-2xl font-black text-neutral-900">
                  {calcCalories}{' '}
                  <span className="text-xs font-normal text-neutral-400">kcal</span>
                </div>
                <p className="text-[11px] text-neutral-500 font-medium">
                  Based on {quantity}g portion size
                </p>
              </div>
            </div>

            {/* Macro Breakdown Strip */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Macronutrient Density
              </h4>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/60 text-center">
                  <span className="text-[10px] font-bold text-blue-600 block uppercase">Protein</span>
                  <span className="text-base font-black text-blue-900">{calcProtein}g</span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5 font-medium">
                    {calcCalories > 0 ? Math.round(((calcProtein * 4) / calcCalories) * 100) : 0}% cal
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-center">
                  <span className="text-[10px] font-bold text-emerald-600 block uppercase">Carbs</span>
                  <span className="text-base font-black text-emerald-900">{calcCarbs}g</span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5 font-medium">
                    {calcCalories > 0 ? Math.round(((calcCarbs * 4) / calcCalories) * 100) : 0}% cal
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-center">
                  <span className="text-[10px] font-bold text-amber-600 block uppercase">Fats</span>
                  <span className="text-base font-black text-amber-900">{calcFat}g</span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5 font-medium">
                    {calcCalories > 0 ? Math.round(((calcFat * 9) / calcCalories) * 100) : 0}% cal
                  </span>
                </div>
              </div>
            </div>

            {/* Micronutrients Pill List */}
            <div className="p-3.5 rounded-2xl bg-[#faf9f8] border border-neutral-200/60 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Dietary Fiber:</span>
                <span className="font-bold text-neutral-900">{calcFiber}g</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Sodium:</span>
                <span className="font-bold text-neutral-900">{calcSodium}mg</span>
              </div>
            </div>

            {/* Add to Today's Meals Primary Button */}
            <button
              onClick={handleSave}
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging to NutriLens Database...</span>
                </>
              ) : successNotice ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Entry Logged! Redirecting...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Add to Today's Meals</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMeal;
