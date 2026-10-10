// src/pages/NutriLens.tsx
import React, { useState, useEffect } from 'react';
import BarcodeCamera from '../components/BarcodeCamera';
import {
  scanBarcode,
  getAiVerdict,
  getAlternatives,
  type NutriLensProduct,
  type NutriLensAlternative,
  type VerdictResponse,
} from '../api/nutrilensService';
import {
  ScanLine,
  Search,
  Sparkles,
  Flame,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Brain,
  ArrowRight,
  Wheat,
  Droplet,
  Beef,
  CakeSlice,
  Zap,
  Heart,
  XCircle,
  WifiOff,
  Package,
  ChevronDown,
  ChevronUp,
  Star,
  BadgeAlert,
} from 'lucide-react';

// ─── Health Score Ring Component ─────────────────────────────────────────────
const HealthScoreRing: React.FC<{ score: number; verdict: string }> = ({ score, verdict }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color =
    score >= 80 ? '#10b981' : score >= 65 ? '#22c55e' : score >= 45 ? '#f59e0b' : score >= 25 ? '#f97316' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black" style={{ color }}>{score}</span>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">/100</span>
        </div>
      </div>
      <span className="text-xs font-bold text-center" style={{ color }}>{verdict}</span>
    </div>
  );
};

// ─── Nutrient Level Badge ───────────────────────────────────────────────────
const LevelBadge: React.FC<{ label: string; level: string; icon: React.ReactNode }> = ({ label, level, icon }) => {
  const colorMap: Record<string, string> = {
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Moderate: 'bg-amber-50 text-amber-700 border-amber-200',
    High: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold ${colorMap[level] || colorMap.Moderate}`}>
      {icon}
      <span>{label}:</span>
      <span className="font-extrabold">{level}</span>
    </div>
  );
};

// ─── Main NutriLens Page ────────────────────────────────────────────────────
const NutriLens: React.FC = () => {
  // Input states
  const [manualCode, setManualCode] = useState('');
  const [lastScannedCode, setLastScannedCode] = useState('');

  // Scan states
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<NutriLensProduct | null>(null);
  const [error, setError] = useState<string | null>(null);

  // AI Verdict states
  const [verdictLoading, setVerdictLoading] = useState(false);
  const [verdict, setVerdict] = useState<VerdictResponse | null>(null);

  // Alternatives states
  const [altLoading, setAltLoading] = useState(false);
  const [alternatives, setAlternatives] = useState<NutriLensAlternative[]>([]);

  // UI states
  const [showIngredients, setShowIngredients] = useState(false);
  const [showAllergens, setShowAllergens] = useState(false);

  // ─── Reset on new scan ───
  const resetResults = () => {
    setProduct(null);
    setError(null);
    setVerdict(null);
    setAlternatives([]);
    setShowIngredients(false);
    setShowAllergens(false);
  };

  // ─── Main scan handler ───
  const handleScan = async (barcode: string) => {
    const clean = barcode.trim().replace(/\s+/g, '');
    if (!clean) return;

    if (!/^\d{6,14}$/.test(clean)) {
      setError('Please enter a valid 6-14 digit numeric barcode.');
      return;
    }

    if (clean === lastScannedCode && product?.found) return;

    resetResults();
    setLoading(true);
    setLastScannedCode(clean);
    setManualCode(clean);

    try {
      const data = await scanBarcode(clean);
      if (data.found) {
        setProduct(data);
        // Auto-fetch alternatives if categories exist
        if (data.categories.length > 0) {
          fetchAlternatives(data);
        }
      } else {
        setError(`No product found for barcode "${clean}". This barcode may not be in the Open Food Facts database yet.`);
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Failed to scan barcode.';
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network')) {
        setError('Network error. Please check your internet connection and ensure the backend server is running.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleScan(manualCode);
  };

  // ─── AI Verdict ───
  const fetchVerdict = async () => {
    if (!product) return;
    setVerdictLoading(true);
    try {
      const data = await getAiVerdict(product);
      setVerdict(data);
    } catch (err) {
      setVerdict({
        ai_verdict: 'Unable to generate AI verdict at this time. Please try again.',
        source: 'error',
      });
    } finally {
      setVerdictLoading(false);
    }
  };

  // ─── Alternatives ───
  const fetchAlternatives = async (prod: NutriLensProduct) => {
    if (prod.categories.length === 0) return;
    setAltLoading(true);
    try {
      const data = await getAlternatives(prod.barcode, prod.categories[0]);
      setAlternatives(data.filter(alt => alt.health_score > prod.health_score));
    } catch {
      setAlternatives([]);
    } finally {
      setAltLoading(false);
    }
  };

  // Auto-fetch verdict when product loads
  useEffect(() => {
    if (product?.found) {
      fetchVerdict();
    }
  }, [product]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* ━━━ Hero Header (Clean SaaS Style) ━━━ */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200/80">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>NutriLens Intelligence System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            NutriLens Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium max-w-xl">
            Understand your food. Understand your nutrition. Real-time ingredient intelligence, barcode forensics, and personalized health verdicts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-[#faf9f8] border border-neutral-200/60">
          <div className="text-right px-2">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Scanner Engine</span>
            <span className="text-xs font-black text-emerald-700">Auto-Scan Active</span>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mr-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ━━━ LEFT: Scanner & Input (5 cols) ━━━ */}
        <div className="lg:col-span-5 space-y-6">
          {/* Camera Scanner Card */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ScanLine className="w-4.5 h-4.5 text-emerald-600" />
                Barcode Camera
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </h3>

            <BarcodeCamera
              active={true}
              onScan={(scannedCode) => {
                if (scannedCode !== lastScannedCode && !loading) {
                  handleScan(scannedCode);
                }
              }}
            />

            {/* Manual Input */}
            <form onSubmit={handleManualSubmit} className="space-y-3 pt-1">
              <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                Manual Barcode Entry
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -tranneutral-y-1/2" />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter 6-14 digit barcode..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-mono font-bold"
                />
              </div>
              <button
                type="submit"
                disabled={!manualCode.trim() || loading}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Scanning Database...</span>
                  </>
                ) : (
                  <>
                    <ScanLine className="w-4 h-4" />
                    <span>Scan Barcode</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Tips */}
          {!product && !loading && !error && (
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-neutral-700">💡 Quick Tips</h4>
              <ul className="space-y-2 text-[11px] text-neutral-500 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  Hold barcode steady within the camera frame for auto-detection
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  Supports EAN-13, UPC-A, EAN-8, UPC-E, CODE-128 formats
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  Try: <span className="font-mono font-bold text-neutral-700">5449000000996</span> (Coca-Cola)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  Or: <span className="font-mono font-bold text-neutral-700">7622210449283</span> (Oreo)
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* ━━━ RIGHT: Results Area (7 cols) ━━━ */}
        <div className="lg:col-span-7 space-y-6">
          {/* Loading State */}
          {loading && (
            <div className="bg-white p-14 rounded-2xl border border-neutral-200/80 shadow-2xs text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900">Querying Food Database...</h4>
              <p className="text-xs text-neutral-500 font-medium">Fetching verified nutrition data from Open Food Facts.</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
                {error.includes('Network') || error.includes('internet') ? (
                  <WifiOff className="w-7 h-7" />
                ) : error.includes('not found') || error.includes('Not Found') ? (
                  <Package className="w-7 h-7" />
                ) : error.includes('Invalid') ? (
                  <XCircle className="w-7 h-7" />
                ) : (
                  <AlertTriangle className="w-7 h-7" />
                )}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-neutral-900">
                  {error.includes('Network') ? 'Connection Error' :
                   error.includes('not found') ? 'Product Not Found' :
                   error.includes('Invalid') ? 'Invalid Barcode' :
                   'Scan Error'}
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1.5 font-medium leading-relaxed">
                  {error}
                </p>
              </div>
              <button
                onClick={() => { resetResults(); setManualCode(''); setLastScannedCode(''); }}
                className="px-5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-all"
              >
                🔄 Try Another Barcode
              </button>
            </div>
          )}

          {/* Initial Blank State */}
          {!product && !loading && !error && (
            <div className="bg-white p-14 rounded-2xl border border-neutral-200/80 shadow-2xs text-center text-neutral-400 text-xs font-medium space-y-4 flex flex-col items-center justify-center min-h-[350px]">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
                <ScanLine className="w-10 h-10 text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-neutral-800">Ready to Scan</h4>
              <p className="text-xs text-neutral-400 max-w-xs font-medium leading-relaxed">
                Point your camera at a food product barcode or enter the barcode number manually to get detailed nutrition analysis.
              </p>
            </div>
          )}

          {/* ━━━ PRODUCT RESULTS ━━━ */}
          {product && product.found && !loading && (
            <div className="space-y-5">
              {/* Product Hero Card (Clean White SaaS Design) */}
              <div className="premium-card p-6">
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  {/* Product Image */}
                  <div className="shrink-0">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.product_name}
                        className="w-20 h-20 rounded-2xl object-cover bg-[#faf9f8] p-1 border border-neutral-200 shadow-2xs"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black text-2xl">
                        {product.product_name[0]}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {product.brand}
                      </span>
                      {product.nutriscore_grade && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
                          Nutri-Score {product.nutriscore_grade}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-extrabold text-neutral-900 leading-tight">{product.product_name}</h3>
                    <p className="text-[11px] text-neutral-400 font-medium mt-1">
                      Serving: {product.serving_size} · Barcode: <span className="font-mono text-neutral-600">{product.barcode}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Health Score + Nutrient Levels */}
              <div className="premium-card p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Score Ring */}
                  <HealthScoreRing score={product.health_score} verdict={product.health_verdict} />

                  {/* Nutrient Level Breakdown */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                    <LevelBadge label="Calories" level={product.calories_level} icon={<Flame className="w-3.5 h-3.5" />} />
                    <LevelBadge label="Sugar" level={product.sugar_level} icon={<CakeSlice className="w-3.5 h-3.5" />} />
                    <LevelBadge label="Fat" level={product.fat_level} icon={<Droplet className="w-3.5 h-3.5" />} />
                    <LevelBadge label="Sodium" level={product.sodium_level} icon={<Zap className="w-3.5 h-3.5" />} />
                    <LevelBadge label="Protein" level={product.protein_level} icon={<Beef className="w-3.5 h-3.5" />} />
                  </div>
                </div>
              </div>

              {/* Nutrition Facts Table */}
              <div className="premium-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h4 className="text-sm font-bold text-neutral-900">Nutrition Facts (per 100g)</h4>
                  <div className="text-lg font-extrabold text-amber-600 flex items-center gap-1">
                    <Flame className="w-5 h-5 fill-amber-500" />
                    <span>{product.calories} kcal</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-100">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-600">Protein</span>
                    <span className="text-base font-extrabold text-blue-700">{product.protein}g</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-100">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600">Carbohydrates</span>
                    <span className="text-base font-extrabold text-emerald-700">{product.carbohydrates}g</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-100">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-600">Total Fat</span>
                    <span className="text-base font-extrabold text-amber-700">{product.fat}g</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-100">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-purple-600">Sugar</span>
                    <span className="text-base font-extrabold text-purple-700">{product.sugar}g</span>
                  </div>
                </div>

                {/* Additional Nutrients */}
                <div className="divide-y divide-neutral-100 text-xs">
                  <div className="py-2.5 flex justify-between text-neutral-700 font-medium">
                    <span>Sodium</span>
                    <span className="font-bold text-neutral-900">{product.sodium} mg</span>
                  </div>
                  <div className="py-2.5 flex justify-between text-neutral-700 font-medium">
                    <span>Dietary Fiber</span>
                    <span className="font-bold text-neutral-900">{product.fiber}g</span>
                  </div>
                  <div className="py-2.5 flex justify-between text-neutral-700 font-medium">
                    <span>Saturated Fat</span>
                    <span className="font-bold text-neutral-900">{product.saturated_fat}g</span>
                  </div>
                </div>
              </div>

              {/* Ingredients (Collapsible) */}
              {product.ingredients && (
                <div className="premium-card overflow-hidden">
                  <button
                    onClick={() => setShowIngredients(!showIngredients)}
                    className="w-full p-5 flex items-center justify-between text-sm font-bold text-neutral-900 hover:bg-[#faf9f8]/50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Wheat className="w-4 h-4 text-amber-600" />
                      Ingredients
                    </span>
                    {showIngredients ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                  </button>
                  {showIngredients && (
                    <div className="px-5 pb-5">
                      <p className="text-xs text-neutral-600 font-medium leading-relaxed bg-[#faf9f8] p-3.5 rounded-2xl border border-neutral-200">
                        {product.ingredients}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Allergens (Collapsible) */}
              {product.allergens.length > 0 && (
                <div className="premium-card overflow-hidden">
                  <button
                    onClick={() => setShowAllergens(!showAllergens)}
                    className="w-full p-5 flex items-center justify-between text-sm font-bold text-amber-900 bg-amber-50/50 hover:bg-amber-50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <BadgeAlert className="w-4 h-4 text-amber-600" />
                      Allergens ({product.allergens.length})
                    </span>
                    {showAllergens ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-amber-400" />}
                  </button>
                  {showAllergens && (
                    <div className="px-5 pb-5">
                      <div className="flex flex-wrap gap-2">
                        {product.allergens.map((allergen, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold"
                          >
                            ⚠️ {allergen}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AI Nutrition Verdict */}
              <div className="premium-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <Brain className="w-4.5 h-4.5 text-violet-600" />
                    AI Nutrition Verdict
                  </h4>
                  {verdict && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      verdict.source === 'gemini'
                        ? 'bg-violet-50 text-violet-700 border-violet-200'
                        : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                    }`}>
                      {verdict.source === 'gemini' ? '✨ Gemini AI' : '🔧 Analysis Engine'}
                    </span>
                  )}
                </div>

                {verdictLoading && (
                  <div className="p-6 text-center space-y-2">
                    <RefreshCw className="w-5 h-5 text-violet-500 animate-spin mx-auto" />
                    <p className="text-xs text-neutral-400 font-medium">Generating AI analysis...</p>
                  </div>
                )}

                {verdict && !verdictLoading && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white text-xs leading-relaxed whitespace-pre-line border border-neutral-700">
                      {verdict.ai_verdict}
                    </div>

                    {verdict.personalized_recommendation && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs leading-relaxed space-y-1.5">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                          <Heart className="w-3.5 h-3.5 text-emerald-600" />
                          Personalized for You
                        </div>
                        <p className="text-emerald-700 font-medium">
                          {verdict.personalized_recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {!verdict && !verdictLoading && (
                  <button
                    onClick={fetchVerdict}
                    className="w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-lg shadow-violet-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Brain className="w-4 h-4" />
                    Generate AI Verdict
                  </button>
                )}
              </div>

              {/* Healthier Alternatives */}
              <div className="premium-card p-6 space-y-4">
                <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  Healthier Alternatives
                </h4>

                {altLoading ? (
                  <div className="p-6 text-center text-xs text-neutral-400 font-medium flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Searching for healthier options...
                  </div>
                ) : alternatives.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {alternatives.map((alt) => (
                      <div
                        key={alt.barcode}
                        onClick={() => handleScan(alt.barcode)}
                        className="p-3.5 rounded-2xl border border-neutral-200/80 hover:border-emerald-400 hover:bg-emerald-50/50 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          {alt.image ? (
                            <img src={alt.image} alt={alt.product_name} className="w-10 h-10 rounded-xl object-cover bg-white p-0.5 border border-neutral-200 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                              {alt.product_name[0]}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-neutral-900 truncate">{alt.product_name}</h5>
                            <p className="text-[10px] text-neutral-400 font-medium truncate">{alt.brand}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-[10px] font-bold">
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Score: {alt.health_score}
                          </span>
                          <span className="text-neutral-500">{alt.calories} kcal</span>
                          <span className="text-blue-600">P: {alt.protein}g</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#faf9f8] border border-neutral-200 text-center text-xs text-neutral-400 font-medium">
                    {product.categories.length === 0
                      ? 'No category data available to find alternatives.'
                      : 'No healthier alternatives found in this category.'}
                  </div>
                )}
              </div>

              {/* Scan Another Button */}
              <div className="text-center">
                <button
                  onClick={() => { resetResults(); setManualCode(''); setLastScannedCode(''); }}
                  className="px-6 py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs transition-all inline-flex items-center gap-2"
                >
                  <ScanLine className="w-4 h-4" />
                  Scan Another Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutriLens;
