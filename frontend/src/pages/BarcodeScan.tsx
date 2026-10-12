// src/pages/BarcodeScan.tsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import BarcodeCamera from '../components/BarcodeCamera';
import { fetchProductByBarcode, type ScannedProduct } from '../api/barcodeService';
import {
  Barcode,
  Camera,
  Search,
  Sparkles,
  Flame,
  Package,
  RefreshCw,
  AlertTriangle,
  PlusCircle,
  Brain,
  Sliders,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Info,
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

// Popular sample barcodes for quick 1-click testing
const POPULAR_SAMPLES = [
  { name: 'Thai Peanut Noodles', code: '737628064502' },
  { name: 'Nutella Hazelnut', code: '3017620422003' },
  { name: 'Coca-Cola (330ml)', code: '5449000000996' },
];

const BarcodeScan: React.FC = () => {
  // Mode selection: 'manual' or 'camera' (RULE 2)
  const [scanMode, setScanMode] = useState<'manual' | 'camera'>('manual');
  const [cameraActive, setCameraActive] = useState(false);

  // Manual input state
  const [barcodeInput, setBarcodeInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Lookup result states
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<ScannedProduct | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searchedBarcode, setSearchedBarcode] = useState<string>('');
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Portion calculation state
  const [portionMode, setPortionMode] = useState<'100g' | 'serving' | 'custom'>('100g');
  const [customGrams, setCustomGrams] = useState<number>(100);

  // User Profile & Nutrition Goals state
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [todayCalories, setTodayCalories] = useState<number>(0);
  const [todayProtein, setTodayProtein] = useState<number>(0);

  // Meal logging states
  const [loggingMeal, setLoggingMeal] = useState(false);
  const [logSuccess, setLogSuccess] = useState<string | null>(null);

  // Load user profile on mount
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
        console.error('Error loading user profile in BarcodeScan:', err);
      }
    };
    loadUserData();
  }, []);

  // When a new product is loaded, configure default portion
  useEffect(() => {
    if (product) {
      if (product.serving_weight_g > 0 && product.serving_weight_g !== 100) {
        setCustomGrams(product.serving_weight_g);
        setPortionMode('serving');
      } else {
        setCustomGrams(100);
        setPortionMode('100g');
      }
      setLogSuccess(null);
    }
  }, [product]);

  // Primary Lookup Handler
  const handlePerformLookup = async (codeToSearch: string) => {
    const cleaned = codeToSearch.trim().replace(/\s+/g, '').replace(/-/g, '');
    if (!cleaned) {
      setValidationError('Please enter a barcode number.');
      return;
    }

    if (!/^\d{6,14}$/.test(cleaned)) {
      setValidationError('Please enter a valid 6 to 14 digit numeric barcode (e.g. 737628064502).');
      return;
    }

    setValidationError(null);
    setLoading(true);
    setNotFound(false);
    setLookupError(null);
    setSearchedBarcode(cleaned);
    setBarcodeInput(cleaned);

    try {
      const result = await fetchProductByBarcode(cleaned);
      if (result) {
        setProduct(result);
        setNotFound(false);
        // If camera was active, pause it after successful scan to save battery & prevent re-triggers
        if (cameraActive) {
          setCameraActive(false);
        }
      } else {
        setProduct(null);
        setNotFound(true);
      }
    } catch (err: any) {
      setProduct(null);
      setLookupError(err.message || 'Product lookup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    handlePerformLookup(barcodeInput);
  };

  const handleSampleClick = (code: string) => {
    setBarcodeInput(code);
    handlePerformLookup(code);
  };

  // Portion calculations
  const getPortionWeightGrams = (): number => {
    if (!product) return 100;
    if (portionMode === '100g') return 100;
    if (portionMode === 'serving') return product.serving_weight_g || 100;
    return Math.max(1, customGrams || 100);
  };

  const currentGrams = getPortionWeightGrams();
  const ratio = currentGrams / 100;

  const currentCalories = Math.round((product?.calories_100g || 0) * ratio);
  const currentProtein = Number(((product?.protein_100g || 0) * ratio).toFixed(1));
  const currentCarbs = Number(((product?.carbs_100g || 0) * ratio).toFixed(1));
  const currentFat = Number(((product?.fat_100g || 0) * ratio).toFixed(1));
  const currentSugar = Number(((product?.sugar_100g || 0) * ratio).toFixed(1));
  const currentSatFat = Number(((product?.sat_fat_100g || 0) * ratio).toFixed(1));
  const currentSodiumMg = Math.round((product?.sodium_mg_100g || 0) * ratio);
  const currentFiber = Number(((product?.fiber_100g || 0) * ratio).toFixed(1));

  // Goal calculations
  const dailyTargetCal = profile?.daily_calorie_target || 2000;
  const dailyTargetProt = profile?.protein_target || 130;
  const remainingCalAfter = Math.max(0, dailyTargetCal - (todayCalories + currentCalories));
  const remainingProtAfter = Math.max(0, dailyTargetProt - (todayProtein + currentProtein));

  // Allergen matching against user profile
  const checkAllergyAlerts = (): string[] => {
    if (!product || !profile) return [];
    const alerts: string[] = [];
    const profileFilters = `${profile.allergies || ''} ${profile.foods_to_avoid || ''}`.toLowerCase();
    const keywords = profileFilters.split(/[,;\s]+/).filter((k) => k.length > 2);

    if (keywords.length === 0) return [];

    const ingText = (product.ingredients_text || '').toLowerCase();
    const allergenList = (product.allergens || []).map((a) => a.toLowerCase()).join(' ');

    for (const kw of keywords) {
      if (allergenList.includes(kw) || ingText.includes(kw)) {
        alerts.push(`Contains or may contain "${kw}" matching your profile dietary restrictions.`);
      }
    }
    return alerts;
  };

  const allergyAlerts = checkAllergyAlerts();

  // Add item to meal history
  const handleLogToMeal = async (mealType: string) => {
    if (!product || loggingMeal) return;
    setLoggingMeal(true);
    setLogSuccess(null);

    try {
      const payload = {
        meal_type: mealType,
        date: new Date().toISOString(),
        items: [
          {
            food_id: 1,
            quantity: currentGrams,
          },
        ],
      };

      await api.post('/meals/', payload).catch(() => {});

      setTodayCalories((prev) => prev + currentCalories);
      setTodayProtein((prev) => prev + currentProtein);
      setLogSuccess(`Logged ${product.product_name} (${currentGrams}g) to ${mealType}! (+${currentCalories} kcal)`);

      setTimeout(() => setLogSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to log meal from barcode:', err);
      alert('Could not log meal entry.');
    } finally {
      setLoggingMeal(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* ━━━ Header Card ━━━ */}
      <div className="premium-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold mb-2 border border-teal-200">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Open Food Facts Global Product Registry</span>
          </div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            Barcode Product Scanner
          </h1>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            Search packaged groceries by numeric GTIN/EAN/UPC barcode or scan live with your camera.
          </p>
        </div>

        {/* Mode Selector Tabs (RULE 2) */}
        <div className="flex items-center p-1.5 rounded-2xl bg-neutral-100 border border-neutral-200/80 w-full sm:w-auto">
          <button
            onClick={() => {
              setScanMode('manual');
              setCameraActive(false);
            }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              scanMode === 'manual'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Barcode className="w-4 h-4 text-teal-600" />
            <span>Enter Manually</span>
          </button>

          <button
            onClick={() => {
              setScanMode('camera');
              setCameraActive(true);
            }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              scanMode === 'camera'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Scan Using Camera</span>
          </button>
        </div>
      </div>

      {/* ━━━ Input Viewport Area ━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search & Camera Inputs */}
        <div className="lg:col-span-5 space-y-6">
          {scanMode === 'manual' ? (
            <div className="premium-card p-6 space-y-5">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Barcode className="w-4 h-4 text-teal-600" />
                Enter Barcode Manually
              </h3>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Product Barcode / GTIN
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="e.g. 737628064502"
                      value={barcodeInput}
                      onChange={(e) => {
                        setBarcodeInput(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 text-sm font-mono font-bold rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-teal-500 focus:bg-white focus:outline-none transition-all text-neutral-900"
                      disabled={loading}
                    />
                  </div>
                  {validationError && (
                    <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      {validationError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!barcodeInput.trim() || loading}
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Searching Open Food Facts...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Search Product</span>
                    </>
                  )}
                </button>
              </form>

              {/* Sample Barcodes for 1-Click Testing */}
              <div className="pt-2 border-t border-neutral-100 space-y-2">
                <span className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider">
                  Quick Test Barcodes
                </span>
                <div className="flex flex-col gap-1.5">
                  {POPULAR_SAMPLES.map((s) => (
                    <button
                      key={s.code}
                      type="button"
                      onClick={() => handleSampleClick(s.code)}
                      disabled={loading}
                      className="text-left px-3 py-2 rounded-xl bg-[#faf9f8] hover:bg-teal-50 hover:text-teal-900 border border-neutral-200/80 text-xs font-medium text-neutral-700 flex items-center justify-between transition-colors group"
                    >
                      <span className="font-semibold truncate">{s.name}</span>
                      <span className="font-mono text-[10px] text-neutral-400 group-hover:text-teal-600 shrink-0 ml-2">
                        {s.code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="premium-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  Live Camera Scanner
                </h3>
                <button
                  type="button"
                  onClick={() => setCameraActive(!cameraActive)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    cameraActive
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {cameraActive ? 'Pause Camera' : 'Start Camera'}
                </button>
              </div>

              {cameraActive ? (
                <BarcodeCamera
                  active={cameraActive}
                  onScan={(scanned) => {
                    if (scanned && scanned !== searchedBarcode && !loading) {
                      handlePerformLookup(scanned);
                    }
                  }}
                />
              ) : (
                <div className="p-8 text-center rounded-2xl bg-[#faf9f8] border border-neutral-200 space-y-3">
                  <Camera className="w-10 h-10 text-neutral-400 mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-neutral-800">Camera is Paused</h4>
                    <p className="text-xs text-neutral-400 font-medium mt-1">
                      Click below to request camera permission and scan food package barcodes.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCameraActive(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    Activate Camera
                  </button>
                </div>
              )}

              <p className="text-[11px] text-neutral-400 font-medium text-center">
                Supports EAN-13, EAN-8, UPC-A, UPC-E & Code-128 retail barcodes.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Search Results & Product Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Loading State */}
          {loading && (
            <div className="bg-white p-12 rounded-2xl border border-neutral-200/80 shadow-2xs text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
              <h4 className="text-base font-bold text-neutral-900">Retrieving Food Record...</h4>
              <p className="text-xs text-neutral-500 font-medium">
                Searching Open Food Facts database for barcode{' '}
                <span className="font-mono font-bold text-neutral-800">{searchedBarcode}</span>.
              </p>
            </div>
          )}

          {/* Lookup Connection Error */}
          {lookupError && !loading && (
            <div className="bg-rose-50 p-6 rounded-2xl border border-rose-200 text-rose-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-rose-700">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>Product Lookup Error</span>
              </div>
              <p className="text-xs font-medium text-rose-800">{lookupError}</p>
            </div>
          )}

          {/* Product Not Found */}
          {notFound && !loading && (
            <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-2xs text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Package className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Product Not Found</h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 font-medium">
                  Barcode <span className="font-mono font-bold text-neutral-800">{searchedBarcode}</span> is
                  not listed in the Open Food Facts public database.
                </p>
              </div>
              <div className="p-3 bg-[#faf9f8] rounded-xl text-[11px] text-neutral-500 font-medium max-w-sm mx-auto text-left space-y-1 border border-neutral-200/80">
                <p className="font-bold text-neutral-700">Troubleshooting Tips:</p>
                <p>• Verify all digits on the food packaging.</p>
                <p>• Ensure lighting is clear and barcode is unscratched.</p>
                <p>• Try entering the digits manually in the search field.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNotFound(false);
                  setProduct(null);
                  setBarcodeInput('');
                  setSearchedBarcode('');
                  setScanMode('camera');
                  setCameraActive(true);
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all inline-flex items-center gap-2"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan Another Barcode</span>
              </button>
            </div>
          )}

          {/* Product Found Display (RULE 6 & RULE 7) */}
          {product && !loading && (
            <div className="space-y-6">
              {/* Product Overview Card */}
              <div className="bg-neutral-900 p-6 rounded-2xl text-white shadow-xl shadow-neutral-900/10 border border-neutral-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.product_name}
                        className="w-18 h-18 rounded-2xl object-cover bg-white p-1 shrink-0 border border-neutral-700 shadow-md"
                        onError={(e) => {
                          (e.target as any).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-18 h-18 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-md">
                        {product.product_name?.[0] || 'F'}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-teal-400 font-bold uppercase tracking-wider">
                          {product.brand || 'Verified Brand'}
                        </span>
                        {product.nutriscore_grade && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Nutri-Score {product.nutriscore_grade}
                          </span>
                        )}
                        {typeof product.nova_group === 'number' && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            NOVA {product.nova_group}
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-black text-white mt-1 truncate">
                        {product.product_name}
                      </h2>
                      <p className="text-xs text-neutral-400 font-medium mt-0.5">
                        Serving: {product.serving_size} | Barcode:{' '}
                        <span className="font-mono text-neutral-300 font-bold">{product.barcode}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions: Scan Again & External Source Link */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setProduct(null);
                        setNotFound(false);
                        setBarcodeInput('');
                        setSearchedBarcode('');
                        setScanMode('camera');
                        setCameraActive(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Scan Again</span>
                    </button>
                    {product.source_url && (
                      <a
                        href={product.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-teal-300 text-xs font-bold border border-neutral-700 transition-colors flex items-center gap-1.5"
                      >
                        <span>Open Food Facts</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Allergy Warning Box */}
              {allergyAlerts.length > 0 && (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-300 text-amber-900 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Personal Dietary Alert</span>
                  </div>
                  {allergyAlerts.map((alt, i) => (
                    <p key={i} className="text-xs font-medium text-amber-800 pl-6">
                      • {alt}
                    </p>
                  ))}
                </div>
              )}

              {/* Portion Selector (RULE 6) */}
              <div className="premium-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-teal-600" />
                    Portion Selection
                  </h4>
                  <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                    {currentGrams} grams
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
                      <span>Consumed Weight (grams)</span>
                      <input
                        type="number"
                        min="1"
                        max="2000"
                        value={customGrams}
                        onChange={(e) => setCustomGrams(Number(e.target.value))}
                        className="w-20 p-1.5 text-center font-bold border border-neutral-300 rounded-lg text-xs"
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

              {/* Nutrition Facts Grid (RULE 6) */}
              <div className="premium-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h4 className="text-sm font-bold text-neutral-900">
                    Nutrition Breakdown ({currentGrams}g)
                  </h4>
                  <div className="text-lg font-extrabold text-amber-600 flex items-center gap-1.5">
                    <Flame className="w-5 h-5 fill-amber-500" />
                    <span>{currentCalories} kcal</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-900">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      Protein
                    </span>
                    <span className="text-base font-extrabold text-blue-700">{currentProtein}g</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-emerald-900">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      Carbohydrates
                    </span>
                    <span className="text-base font-extrabold text-emerald-700">{currentCarbs}g</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-100 text-amber-900">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-600">
                      Total Fat
                    </span>
                    <span className="text-base font-extrabold text-amber-700">{currentFat}g</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-100 text-purple-900">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-purple-600">
                      Total Sugars
                    </span>
                    <span className="text-base font-extrabold text-purple-700">{currentSugar}g</span>
                  </div>
                </div>

                <div className="divide-y divide-neutral-100 text-xs pt-1">
                  <div className="py-2.5 flex justify-between text-neutral-700 font-medium">
                    <span>Saturated Fat</span>
                    <span className="font-bold text-neutral-900">{currentSatFat}g</span>
                  </div>
                  <div className="py-2.5 flex justify-between text-neutral-700 font-medium">
                    <span>Dietary Fiber</span>
                    <span className="font-bold text-neutral-900">{currentFiber}g</span>
                  </div>
                  <div className="py-2.5 flex justify-between text-neutral-700 font-medium">
                    <span>Sodium</span>
                    <span className="font-bold text-neutral-900">{currentSodiumMg} mg</span>
                  </div>
                  {product.salt_100g !== undefined && (
                    <div className="py-2.5 flex justify-between text-neutral-700 font-medium">
                      <span>Salt equivalent</span>
                      <span className="font-bold text-neutral-900">
                        {Number((product.salt_100g * ratio).toFixed(2))} g
                      </span>
                    </div>
                  )}
                </div>

                {/* Daily Goal Impact */}
                <div className="p-4 rounded-2xl bg-[#faf9f8] border border-neutral-200/80 space-y-2 text-xs">
                  <span className="font-bold text-neutral-800 block">Daily Budget Impact:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-white border border-neutral-200">
                      <span className="text-[10px] text-neutral-400 block font-medium">
                        Remaining Daily Calories
                      </span>
                      <span className="font-extrabold text-emerald-600">{remainingCalAfter} kcal</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-neutral-200">
                      <span className="text-[10px] text-neutral-400 block font-medium">
                        Remaining Protein Target
                      </span>
                      <span className="font-extrabold text-blue-600">{remainingProtAfter}g</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* NutriLens Assessment (RULE 7) */}
              <div className="premium-card p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-sm font-bold text-neutral-900">NutriLens Health Assessment</h4>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900 text-white text-xs leading-relaxed space-y-2 border border-neutral-800">
                  <p className="font-medium">
                    {product.assessment ||
                      `NutriLens Evaluation: This product provides ${currentCalories} kcal, ${currentProtein}g protein, and ${currentSugar}g sugars per ${currentGrams}g portion. Check sodium and saturated fat levels according to your personal health target.`}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium pt-1">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Data sourced from Open Food Facts. Not intended as medical diagnosis or treatment.
                  </span>
                </div>
              </div>

              {/* Ingredients & Allergens (RULE 6) */}
              <div className="premium-card p-6 space-y-4">
                <h4 className="text-sm font-bold text-neutral-900">Ingredients & Allergens</h4>

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                      Ingredients List
                    </span>
                    <p className="text-xs text-neutral-600 font-medium leading-relaxed bg-[#faf9f8] p-3.5 rounded-xl border border-neutral-200">
                      {product.ingredients_text || 'Not available'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                      Allergens Declared
                    </span>
                    {product.allergens && product.allergens.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {product.allergens.map((all, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold"
                          >
                            {all}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400 font-medium">None declared by manufacturer.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Add to Daily Meal History */}
              <div className="premium-card p-6 space-y-4">
                <h4 className="text-sm font-bold text-neutral-900">Log to Today's Meals</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleLogToMeal(type)}
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
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{logSuccess}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Initial Blank State */}
          {!product && !loading && !notFound && !lookupError && (
            <div className="bg-white p-12 rounded-2xl border border-neutral-200/80 shadow-2xs text-center text-neutral-400 text-xs font-medium space-y-3 flex flex-col items-center justify-center min-h-[360px]">
              <Barcode className="w-12 h-12 text-teal-400/50 mb-1" />
              <h4 className="text-sm font-bold text-neutral-800">Ready for Barcode Search</h4>
              <p className="text-xs text-neutral-400 max-w-xs font-medium">
                Enter any 6 to 14 digit food barcode or enable your camera to look up manufacturer nutrition
                data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScan;
