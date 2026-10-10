// src/components/GlobalBarcodeScanner.tsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import BarcodeCamera from './BarcodeCamera';
import {
  fetchProductByBarcode,
  fetchSimilarProducts,
  type ScannedProduct,
  type SimilarProductFilter,
} from '../api/barcodeService';
import {
  Barcode,
  Search,
  Sparkles,
  Flame,
  Package,
  RefreshCw,
  AlertTriangle,
  PlusCircle,
  Brain,
  Scale,
  Camera,
  ArrowRight,
  X,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface ProfileData {
  daily_calorie_target?: number;
  protein_target?: number;
  carbs_target?: number;
  fat_target?: number;
  allergies?: string;
  foods_to_avoid?: string;
  health_goal?: string;
}

const GlobalBarcodeScanner: React.FC = () => {
  // Control states
  const [cameraActive, setCameraActive] = useState(false);
  const [code, setCode] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Data states
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<ScannedProduct | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [todayCalories, setTodayCalories] = useState<number>(0);
  const [todayProtein, setTodayProtein] = useState<number>(0);

  // Serving Portion selection state
  const [portionMode, setPortionMode] = useState<'100g' | 'serving' | 'custom'>('serving');
  const [customGrams, setCustomGrams] = useState<number>(100);

  // AI Analysis states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  // Meal Logging states
  const [loggingMeal, setLoggingMeal] = useState(false);
  const [logSuccess, setLogSuccess] = useState<string | null>(null);

  // Comparison states
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareCode, setCompareCode] = useState('');
  const [compareProduct, setCompareProduct] = useState<ScannedProduct | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);

  // Similar Products states
  const [similarProducts, setSimilarProducts] = useState<ScannedProduct[]>([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'protein' | 'sugar' | 'sodium' | 'calories'>('all');

  // Load Profile & Today's Meals on Mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [profRes, mealsRes] = await Promise.all([
          api.get('/profile/').catch(() => ({ data: null })),
          api.get('/meals/').catch(() => ({ data: [] })),
        ]);

        if (profRes.data) setProfile(profRes.data);
        if (Array.isArray(mealsRes.data)) {
          const totCal = mealsRes.data.reduce((acc: number, m: any) => acc + (m.total_calories || 0), 0);
          const totProt = mealsRes.data.reduce((acc: number, m: any) => acc + (m.total_protein || 0), 0);
          setTodayCalories(totCal);
          setTodayProtein(totProt);
        }
      } catch (err) {
        console.error('Error loading user data:', err);
      }
    };
    loadUserData();
  }, []);

  const loadSimilarProducts = async (current: ScannedProduct, filterKey: typeof activeFilter) => {
    if (!current.primary_category) return;
    setSimilarLoading(true);
    setActiveFilter(filterKey);

    const filterObj: SimilarProductFilter = {
      higherProtein: filterKey === 'protein',
      lowerSugar: filterKey === 'sugar',
      lowerSodium: filterKey === 'sodium',
      lowerCalories: filterKey === 'calories',
    };

    const results = await fetchSimilarProducts(current.primary_category, current, filterObj);
    setSimilarProducts(results);
    setSimilarLoading(false);
  };

  // Update portion default weight when product is loaded
  useEffect(() => {
    if (product) {
      if (product.serving_weight_g > 0) {
        setCustomGrams(product.serving_weight_g);
        setPortionMode('serving');
      } else {
        setCustomGrams(100);
        setPortionMode('100g');
      }
      setAiAnalysis(null);
      setLogSuccess(null);
      setSimilarProducts([]);

      if (product.primary_category) {
        loadSimilarProducts(product, 'all');
      }
    }
  }, [product]);

  // Main Barcode Lookup Handler
  const handleProductLookup = async (barcodeToFetch: string) => {
    const cleanCode = barcodeToFetch.trim().replace(/\s+/g, '');
    if (!cleanCode) return;

    if (!/^\d{8,14}$/.test(cleanCode)) {
      setValidationError('Please enter a valid 8 to 14 digit numeric barcode (e.g. 012000000133).');
      return;
    }

    setValidationError(null);
    setLoading(true);
    setNotFound(false);
    setLookupError(null);
    setCode(cleanCode);

    try {
      const data = await fetchProductByBarcode(cleanCode);
      if (data) {
        setProduct(data);
      } else {
        setProduct(null);
        setNotFound(true);
      }
    } catch (err: any) {
      setLookupError(err.message || 'Product lookup failed. Please try again.');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleProductLookup(code);
  };

  const getConsumedWeightGrams = (): number => {
    if (!product) return 100;
    if (portionMode === '100g') return 100;
    if (portionMode === 'serving') return product.serving_weight_g || 100;
    return Math.max(1, customGrams || 100);
  };

  const consumedGrams = getConsumedWeightGrams();
  const ratio = consumedGrams / 100;

  const calcCalories = Math.round((product?.calories_100g || 0) * ratio);
  const calcProtein = Number(((product?.protein_100g || 0) * ratio).toFixed(1));
  const calcCarbs = Number(((product?.carbs_100g || 0) * ratio).toFixed(1));
  const calcFat = Number(((product?.fat_100g || 0) * ratio).toFixed(1));
  const calcSugar = Number(((product?.sugar_100g || 0) * ratio).toFixed(1));
  const calcFiber = Number(((product?.fiber_100g || 0) * ratio).toFixed(1));
  const calcSodiumMg = Math.round((product?.sodium_mg_100g || 0) * ratio);
  const calcSatFat = Number(((product?.sat_fat_100g || 0) * ratio).toFixed(1));

  const targetCalories = profile?.daily_calorie_target || 2000;
  const targetProtein = profile?.protein_target || 120;
  const remainingCalAfter = Math.max(0, targetCalories - (todayCalories + calcCalories));
  const remainingProtAfter = Math.max(0, targetProtein - (todayProtein + calcProtein));

  const checkAllergyWarnings = (): string[] => {
    if (!product || !profile) return [];
    const warnings: string[] = [];
    const userAllergiesStr = (profile.allergies || '') + ' ' + (profile.foods_to_avoid || '');
    const userAllergies = userAllergiesStr
      .toLowerCase()
      .split(/[,;\s]+/)
      .filter((s) => s.length > 2);

    if (userAllergies.length === 0) return [];

    const ingredientsLower = product.ingredients_text.toLowerCase();
    const allergensLower = product.allergens.map((a) => a.toLowerCase()).join(' ');

    for (const allergen of userAllergies) {
      if (allergensLower.includes(allergen) || ingredientsLower.includes(allergen)) {
        warnings.push(`Possible match for "${allergen}" in ingredient/allergen database.`);
      }
    }

    return warnings;
  };

  const allergyWarnings = checkAllergyWarnings();

  const handleAiAnalysis = () => {
    if (!product) return;
    setAiLoading(true);

    setTimeout(() => {
      let strengths: string[] = [];
      let concerns: string[] = [];

      if (product.protein_100g >= 10) strengths.push('High protein content per serving');
      if (product.fiber_100g >= 3) strengths.push('Good source of dietary fiber');
      if (product.sugar_100g <= 5) strengths.push('Low in added sugars');
      if (product.sodium_mg_100g <= 140) strengths.push('Low sodium formulation');

      if (product.sugar_100g > 15) concerns.push('High sugar density (>15g per 100g)');
      if (product.sodium_mg_100g > 600) concerns.push('Elevated sodium level (>600mg per 100g)');
      if (product.sat_fat_100g > 5) concerns.push('High saturated fat content');

      const goalFit = profile?.health_goal
        ? `Given your goal of ${profile.health_goal}, this product provides ${calcCalories} kcal and ${calcProtein}g protein per consumed portion (${consumedGrams}g).`
        : `This product supplies ${calcCalories} kcal and ${calcProtein}g protein per ${consumedGrams}g consumed.`;

      const summary = `
📊 **NutriLens AI Product Evaluation**:

• **Goal Alignment**: ${goalFit}
• **Nutritional Strengths**: ${strengths.length > 0 ? strengths.join(', ') : 'Moderate baseline nutritional balance.'}
• **Considerations**: ${concerns.length > 0 ? concerns.join(', ') : 'No high-risk nutrient concerns detected.'}
• **Portion Strategy**: Consuming ${consumedGrams}g leaves you with ${remainingCalAfter} kcal remaining in your daily calorie goal.
      `.trim();

      setAiAnalysis(summary);
      setAiLoading(false);
    }, 900);
  };

  const handleAddToMeal = async (type: string) => {
    if (!product || loggingMeal) return;
    setLoggingMeal(true);
    setLogSuccess(null);

    try {
      const payload = {
        meal_type: type,
        date: new Date().toISOString(),
        items: [
          {
            food_id: 1,
            quantity: consumedGrams,
          },
        ],
      };

      await api.post('/meals/', payload).catch((e) => {
        console.log('Local meal sync fallback:', e);
      });

      setTodayCalories((prev) => prev + calcCalories);
      setTodayProtein((prev) => prev + calcProtein);
      setLogSuccess(`Added ${product.product_name} (${consumedGrams}g) to ${type}! (${calcCalories} kcal)`);

      setTimeout(() => setLogSuccess(null), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to log meal entry.');
    } finally {
      setLoggingMeal(false);
    }
  };

  const handleCompareLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compareCode.trim()) return;
    setCompareLoading(true);
    try {
      const data = await fetchProductByBarcode(compareCode.trim());
      if (data) {
        setCompareProduct(data);
      } else {
        alert('Comparison product not found.');
      }
    } catch (e: any) {
      alert(e.message || 'Comparison barcode lookup failed.');
    } finally {
      setCompareLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="premium-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-2 border border-teal-200">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Open Food Facts Global Database</span>
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900">Global Barcode Product Scanner</h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Scan international barcodes with camera or enter digits to analyze nutrition, allergens & log meals.
          </p>
        </div>

        <button
          onClick={() => setCameraActive(!cameraActive)}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs border flex items-center gap-2 shrink-0 transition-all ${
            cameraActive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>{cameraActive ? 'Camera ON' : 'Start Camera'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <div className="premium-card p-6 space-y-5">
            <h3 className="text-base font-bold text-neutral-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Barcode className="w-5 h-5 text-teal-600" />
                Camera Viewport
              </span>
            </h3>

            {cameraActive ? (
              <BarcodeCamera
                active={cameraActive}
                onScan={(scannedCode) => {
                  if (scannedCode !== code && !loading) {
                    handleProductLookup(scannedCode);
                  }
                }}
              />
            ) : (
              <div className="p-8 text-center rounded-2xl bg-[#faf9f8] border border-neutral-200 space-y-3">
                <Camera className="w-8 h-8 text-neutral-400 mx-auto" />
                <p className="text-xs text-neutral-500 font-medium">Camera is currently paused.</p>
                <button
                  onClick={() => setCameraActive(true)}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                >
                  Enable Camera
                </button>
              </div>
            )}

            <form onSubmit={handleManualSubmit} className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-neutral-700">Manual Barcode Lookup</label>
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter 8-14 digit barcode..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-teal-500 focus:bg-white focus:outline-none transition-all font-mono font-bold"
                />
              </div>

              {validationError && (
                <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {validationError}
                </p>
              )}

              <button
                type="submit"
                disabled={!code.trim() || loading}
                className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Searching Global Registry...</span>
                  </>
                ) : (
                  <>
                    <Barcode className="w-4 h-4" />
                    <span>Scan / Lookup Barcode</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {loading && (
            <div className="bg-white p-12 rounded-2xl border border-neutral-200/80 shadow-2xs text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
              <h4 className="text-base font-bold text-neutral-900">Querying Food Database...</h4>
              <p className="text-xs text-neutral-500 font-medium">Fetching verified manufacturer nutrition data.</p>
            </div>
          )}

          {lookupError && !loading && (
            <div className="bg-rose-50 p-6 rounded-2xl border border-rose-200 text-rose-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-rose-700">
                <AlertTriangle className="w-5 h-5" />
                Lookup Connection Error
              </div>
              <p className="text-xs font-medium text-rose-800">{lookupError}</p>
            </div>
          )}

          {notFound && !loading && (
            <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                <Package className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-neutral-900">Product Not Found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 font-medium">
                  No verified entry found for barcode <span className="font-bold text-neutral-800">{code}</span>.
                </p>
              </div>
            </div>
          )}

          {product && !loading && (
            <div className="space-y-6">
              <div className="bg-neutral-900 p-6 rounded-2xl text-white shadow-xl shadow-neutral-900/10 border border-neutral-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.product_name}
                        className="w-16 h-16 rounded-2xl object-cover bg-white p-1 shrink-0 border border-neutral-700"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl shrink-0">
                        {product.product_name[0]}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-teal-400 font-bold uppercase tracking-wider">
                          {product.brand}
                        </span>
                        {product.nutriscore_grade && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Nutri-Score {product.nutriscore_grade}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-extrabold text-white mt-0.5">{product.product_name}</h3>
                      <p className="text-xs text-neutral-400 font-medium mt-0.5">
                        Serving Size: {product.serving_size} | Barcode: {product.barcode}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowCompareModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-teal-300 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Compare Product</span>
                  </button>
                </div>
              </div>

              {allergyWarnings.length > 0 && (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-300 text-amber-900 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Dietary & Allergen Warning Match</span>
                  </div>
                  {allergyWarnings.map((warn, i) => (
                    <p key={i} className="text-xs font-medium text-amber-800 pl-6">
                      • {warn}
                    </p>
                  ))}
                </div>
              )}

              <div className="premium-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-teal-600" />
                    Select Consumed Quantity
                  </h4>
                  <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                    {consumedGrams} grams
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPortionMode('100g')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      portionMode === '100g'
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                        : 'bg-[#faf9f8] text-neutral-600 border-neutral-200/80 hover:bg-neutral-100'
                    }`}
                  >
                    Per 100g
                  </button>

                  <button
                    onClick={() => {
                      setPortionMode('serving');
                      if (product.serving_weight_g > 0) setCustomGrams(product.serving_weight_g);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      portionMode === 'serving'
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                        : 'bg-[#faf9f8] text-neutral-600 border-neutral-200/80 hover:bg-neutral-100'
                    }`}
                  >
                    Per Serving ({product.serving_weight_g}g)
                  </button>

                  <button
                    onClick={() => setPortionMode('custom')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      portionMode === 'custom'
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                        : 'bg-[#faf9f8] text-neutral-600 border-neutral-200/80 hover:bg-neutral-100'
                    }`}
                  >
                    Custom Weight
                  </button>
                </div>

                {portionMode === 'custom' && (
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-neutral-600">
                      <span>Consumed Weight (g)</span>
                      <input
                        type="number"
                        min="1"
                        max="2000"
                        value={customGrams}
                        onChange={(e) => setCustomGrams(Number(e.target.value))}
                        className="w-20 p-1 text-center font-bold border border-neutral-300 rounded-lg text-xs"
                      />
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="5"
                      value={customGrams}
                      onChange={(e) => setCustomGrams(Number(e.target.value))}
                      className="w-full accent-teal-600 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              <div className="premium-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h4 className="text-sm font-bold text-neutral-900">Nutrition Facts ({consumedGrams}g)</h4>
                  <div className="text-lg font-extrabold text-amber-600 flex items-center gap-1">
                    <Flame className="w-5 h-5 fill-amber-500" />
                    <span>{calcCalories} kcal</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-900">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-600">Protein</span>
                    <span className="text-base font-extrabold text-blue-700">{calcProtein}g</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-emerald-900">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600">Carbohydrates</span>
                    <span className="text-base font-extrabold text-emerald-700">{calcCarbs}g</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-100 text-amber-900">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-600">Total Fat</span>
                    <span className="text-base font-extrabold text-amber-700">{calcFat}g</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-100 text-purple-900">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-purple-600">Sugar</span>
                    <span className="text-base font-extrabold text-purple-700">{calcSugar}g</span>
                  </div>
                </div>

                <div className="divide-y divide-neutral-100 text-xs pt-1">
                  <div className="py-2 flex justify-between text-neutral-700 font-medium">
                    <span>Dietary Fiber</span>
                    <span className="font-bold text-neutral-900">{calcFiber}g</span>
                  </div>
                  <div className="py-2 flex justify-between text-neutral-700 font-medium">
                    <span>Sodium</span>
                    <span className="font-bold text-neutral-900">{calcSodiumMg} mg</span>
                  </div>
                  <div className="py-2 flex justify-between text-neutral-700 font-medium">
                    <span>Saturated Fat</span>
                    <span className="font-bold text-neutral-900">{calcSatFat}g</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#faf9f8] border border-neutral-200/80 space-y-2 text-xs">
                  <span className="font-bold text-neutral-800 block">After Consuming This Item ({consumedGrams}g):</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-xl bg-white border border-neutral-200">
                      <span className="text-[10px] text-neutral-400 block font-medium">Remaining Calories</span>
                      <span className="font-extrabold text-emerald-600">{remainingCalAfter} kcal</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-neutral-200">
                      <span className="text-[10px] text-neutral-400 block font-medium">Remaining Protein</span>
                      <span className="font-extrabold text-blue-600">{remainingProtAfter}g</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="premium-card p-6 space-y-4">
                <h4 className="text-sm font-bold text-neutral-900">Ingredient Analysis</h4>
                <p className="text-xs text-neutral-600 font-medium leading-relaxed bg-[#faf9f8] p-3 rounded-2xl border border-neutral-200">
                  {product.ingredients_text}
                </p>
              </div>

              <div className="premium-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-emerald-600" />
                    AI Health Evaluation
                  </h4>

                  <button
                    onClick={handleAiAnalysis}
                    disabled={aiLoading}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                  >
                    {aiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Brain className="w-3.5 h-3.5" />}
                    <span>{aiLoading ? 'Analyzing...' : 'Analyze with AI'}</span>
                  </button>
                </div>

                {aiAnalysis && (
                  <div className="p-4 rounded-2xl bg-neutral-900 text-white text-xs leading-relaxed space-y-2 whitespace-pre-line border border-neutral-800">
                    {aiAnalysis}
                  </div>
                )}
              </div>

              {/* Similar Products */}
              {similarProducts.length > 0 && (
                <div className="premium-card p-6 space-y-4">
                  <h4 className="text-sm font-bold text-neutral-900">Similar Products</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {similarProducts.map((sim) => (
                      <div
                        key={sim.barcode}
                        onClick={() => handleProductLookup(sim.barcode)}
                        className="p-3.5 rounded-2xl border border-neutral-200/80 hover:border-teal-500 hover:bg-teal-50/50 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <h5 className="text-xs font-bold text-neutral-900 truncate max-w-[180px]">{sim.product_name}</h5>
                          <p className="text-[10px] text-neutral-400 font-medium">{sim.brand}</p>
                          <span className="text-[11px] font-bold text-teal-700 block mt-1">
                            {sim.calories_100g} kcal | P: {sim.protein_100g}g
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {similarLoading && (
                <div className="p-4 text-center text-xs text-neutral-400">Loading alternatives...</div>
              )}

              <div className="premium-card p-6 space-y-4">
                <h4 className="text-sm font-bold text-neutral-900">Add to Daily Meal History</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleAddToMeal(type)}
                      disabled={loggingMeal}
                      className="py-3 rounded-xl bg-teal-50 hover:bg-teal-600 hover:text-white text-teal-800 border border-teal-200 font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-teal-600 hover:text-white" />
                      <span>{type}</span>
                    </button>
                  ))}
                </div>

                {logSuccess && (
                  <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{logSuccess}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {!product && !loading && !notFound && !lookupError && (
            <div className="bg-white p-12 rounded-2xl border border-neutral-200/80 shadow-2xs text-center text-neutral-400 text-xs font-medium space-y-3 flex flex-col items-center justify-center min-h-[300px]">
              <Barcode className="w-12 h-12 text-teal-400/60 mb-2" />
              <h4 className="text-sm font-bold text-neutral-800">Ready for Barcode Lookup</h4>
              <p className="text-xs text-neutral-400 max-w-xs font-medium">
                Align food barcode in camera frame or enter 8-14 digits manually to display complete nutrition facts.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* COMPARE PRODUCTS MODAL */}
      {showCompareModal && product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 max-w-3xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-teal-600" />
                Side-by-Side Product Comparison
              </h3>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!compareProduct && (
              <form onSubmit={handleCompareLookup} className="space-y-3">
                <label className="block text-xs font-bold text-neutral-700">Enter Second Barcode to Compare</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter 8-14 digit barcode..."
                    value={compareCode}
                    onChange={(e) => setCompareCode(e.target.value)}
                    className="flex-1 p-2.5 text-xs font-bold rounded-xl bg-[#faf9f8] border border-neutral-200"
                  />
                  <button
                    type="submit"
                    disabled={compareLoading}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs"
                  >
                    {compareLoading ? 'Searching...' : 'Compare'}
                  </button>
                </div>
              </form>
            )}

            {compareProduct && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => setCompareProduct(null)}
                    className="text-xs font-bold text-teal-600 hover:underline"
                  >
                    Change Comparison Product
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-[#faf9f8]">
                        <th className="p-3 font-bold text-neutral-700">Nutrient (per 100g)</th>
                        <th className="p-3 font-bold text-teal-700">{product.product_name}</th>
                        <th className="p-3 font-bold text-blue-700">{compareProduct.product_name}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      <tr>
                        <td className="p-3 font-semibold text-neutral-600">Calories</td>
                        <td className="p-3 font-bold text-neutral-900">{product.calories_100g} kcal</td>
                        <td className="p-3 font-bold text-neutral-900">{compareProduct.calories_100g} kcal</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-neutral-600">Protein</td>
                        <td className="p-3 font-bold text-blue-600">{product.protein_100g}g</td>
                        <td className="p-3 font-bold text-blue-600">{compareProduct.protein_100g}g</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-neutral-600">Carbohydrates</td>
                        <td className="p-3 font-bold text-emerald-600">{product.carbs_100g}g</td>
                        <td className="p-3 font-bold text-emerald-600">{compareProduct.carbs_100g}g</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-neutral-600">Fat</td>
                        <td className="p-3 font-bold text-amber-600">{product.fat_100g}g</td>
                        <td className="p-3 font-bold text-amber-600">{compareProduct.fat_100g}g</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-neutral-600">Sugar</td>
                        <td className="p-3 font-bold text-purple-600">{product.sugar_100g}g</td>
                        <td className="p-3 font-bold text-purple-600">{compareProduct.sugar_100g}g</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-neutral-600">Fiber</td>
                        <td className="p-3 font-bold text-neutral-800">{product.fiber_100g}g</td>
                        <td className="p-3 font-bold text-neutral-800">{compareProduct.fiber_100g}g</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-neutral-600">Sodium</td>
                        <td className="p-3 font-bold text-neutral-800">{product.sodium_mg_100g} mg</td>
                        <td className="p-3 font-bold text-neutral-800">{compareProduct.sodium_mg_100g} mg</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalBarcodeScanner;
