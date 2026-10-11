// src/pages/Dashboard.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import {
  Flame,
  Target,
  TrendingDown,
  PlusCircle,
  Barcode,
  Camera,
  MessageSquare,
  Droplet,
  Utensils,
  Sun,
  Moon,
  Sunset,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { ProgressRing } from '../components/ui/ProgressRing';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';

interface ProfileData {
  age?: number;
  sex?: string;
  height_cm?: number;
  weight_kg?: number;
  activity_level?: string;
  health_goal?: string;
  dietary_preferences?: string;
  allergies?: string;
  foods_to_avoid?: string;
  bmi?: number;
  bmr?: number;
  daily_calorie_target?: number;
  protein_target?: number;
  carbs_target?: number;
  fat_target?: number;
}

interface MealItem {
  id: number;
  created_at?: string;
  date?: string;
  meal_type?: string;
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData>(() => {
    try {
      const cached = localStorage.getItem('nutrilens:cached-profile');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return {
      daily_calorie_target: 2000,
      protein_target: 130,
      carbs_target: 230,
      fat_target: 65,
      health_goal: 'Weight Management',
      bmi: 22.4,
    };
  });
  const [meals, setMeals] = useState<MealItem[]>(() => {
    try {
      const cached = localStorage.getItem('nutrilens:cached-meals');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return [];
  });
  const [syncing, setSyncing] = useState<boolean>(false);
  const [waterCount, setWaterCount] = useState<number>(5); // 5/8 glasses default

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setSyncing(true);
      try {
        const [profileRes, mealsRes] = await Promise.allSettled([
          api.get('/profile/'),
          api.get('/meals/'),
        ]);
        if (!isMounted) return;
        if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
          setProfile(profileRes.value.data);
          try {
            localStorage.setItem('nutrilens:cached-profile', JSON.stringify(profileRes.value.data));
          } catch (e) {}
        }
        if (mealsRes.status === 'fulfilled' && mealsRes.value?.data) {
          setMeals(mealsRes.value.data || []);
          try {
            localStorage.setItem('nutrilens:cached-meals', JSON.stringify(mealsRes.value.data || []));
          } catch (e) {}
        }
      } catch (e) {
        console.error('Failed to load dashboard data:', e);
      } finally {
        if (isMounted) setSyncing(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Time of day greeting (memoized)
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning, Alex 👋', icon: Sun };
    if (hour < 18) return { text: 'Good afternoon, Alex 👋', icon: Sunset };
    return { text: 'Good evening, Alex 👋', icon: Moon };
  }, []);
  const GreetingIcon = greeting.icon;

  // Memoized nutrition totals
  const {
    targetCalories,
    consumedCalories,
    remainingCalories,
    caloriePercent,
    consumedProtein,
    consumedCarbs,
    consumedFat,
    targetProtein,
    targetCarbs,
    targetFat,
  } = useMemo(() => {
    const tCal = profile?.daily_calorie_target || 2000;
    const cCal = meals.reduce((acc, m) => acc + (m.total_calories || 0), 0);
    const rCal = Math.max(0, tCal - cCal);
    const cPct = Math.min(100, Math.round((cCal / tCal) * 100));

    const cProt = meals.reduce((acc, m) => acc + (m.total_protein || 0), 0);
    const cCarb = meals.reduce((acc, m) => acc + (m.total_carbs || 0), 0);
    const cFat = meals.reduce((acc, m) => acc + (m.total_fat || 0), 0);

    const tProt = profile?.protein_target || 130;
    const tCarb = profile?.carbs_target || 230;
    const tFat = profile?.fat_target || 65;

    return {
      targetCalories: tCal,
      consumedCalories: cCal,
      remainingCalories: rCal,
      caloriePercent: cPct,
      consumedProtein: cProt,
      consumedCarbs: cCarb,
      consumedFat: cFat,
      targetProtein: tProt,
      targetCarbs: tCarb,
      targetFat: tFat,
    };
  }, [profile, meals]);

  // BMI calculation (memoized)
  const { bmiValue, bmiBadge } = useMemo(() => {
    let val = profile?.bmi;
    if (!val && profile?.height_cm && profile?.weight_kg) {
      const h = profile.height_cm / 100;
      val = Number((profile.weight_kg / (h * h)).toFixed(1));
    }
    const finalVal = val || 22.4;

    const getBadge = (b: number) => {
      if (b < 18.5) return { label: 'Underweight', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      if (b < 25) return { label: 'Optimal / Normal', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      if (b < 30) return { label: 'Overweight', color: 'bg-orange-50 text-orange-700 border-orange-200' };
      return { label: 'High BMI', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    };

    return { bmiValue: finalVal, bmiBadge: getBadge(finalVal) };
  }, [profile]);

  // Nutrition Quality Score calculation (memoized)
  const nutritionScore = useMemo(() => {
    let score = 75;
    if (consumedCalories > 0 && consumedCalories <= targetCalories) score += 10;
    if (consumedProtein >= targetProtein * 0.7) score += 10;
    if (waterCount >= 4) score += 5;
    return Math.min(96, Math.max(60, score));
  }, [consumedCalories, targetCalories, consumedProtein, targetProtein, waterCount]);

  // Weekly / Daily chart data (memoized)
  const chartData = useMemo(() => [
    { name: 'Protein', Consumed: Math.round(consumedProtein), Target: targetProtein },
    { name: 'Carbs', Consumed: Math.round(consumedCarbs), Target: targetCarbs },
    { name: 'Healthy Fats', Consumed: Math.round(consumedFat), Target: targetFat },
  ], [consumedProtein, targetProtein, consumedCarbs, targetCarbs, consumedFat, targetFat]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ━━━ 1. Health Summary Top Area (Premium Dark Hero) ━━━ */}
      <div className="relative overflow-hidden rounded-[2rem] bg-[#111111] text-white shadow-2xl p-6 sm:p-10 border border-neutral-800/60 transition-all">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-emerald-600/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[50%] rounded-full bg-teal-600/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-neutral-800">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md text-emerald-400 text-xs font-bold mb-4 border border-white/10 shadow-sm">
              <GreetingIcon className="w-4 h-4" />
              <span className="tracking-wide uppercase">{greeting.text}</span>
              {syncing && (
                <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300/80 lowercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  syncing
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2">
              Your Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Nutrition</span>
            </h1>
            <p className="text-sm text-neutral-400 font-medium max-w-xl leading-relaxed">
              {remainingCalories > 0 ? (
                <>You're <span className="text-emerald-400 font-bold">{remainingCalories.toLocaleString()} kcal</span> away from your target. Maintain your macros for <span className="text-white font-semibold">{profile?.health_goal || 'Weight Management'}</span>.</>
              ) : (
                <>Target reached. Great job! Focus on clean hydration and rest.</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/add-meal')}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-sm transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <PlusCircle className="w-4 h-4" />
              Log Meal
            </button>
            <button
              onClick={() => navigate('/diet-plan')}
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold text-sm transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <Utensils className="w-4 h-4 text-emerald-400" />
              Schedule
            </button>
          </div>
        </div>

        {/* Hero Interactive Gauges & Macro Status */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 pt-8">
          {/* Calorie Progress Ring */}
          <div className="md:col-span-4 flex items-center gap-6 p-5 rounded-3xl bg-black/40 border border-white/5 backdrop-blur-xl">
            <ProgressRing
              progress={caloriePercent}
              size={120}
              strokeWidth={10}
              color="#34d399"
              trackColor="rgba(255,255,255,0.1)"
            >
              <span className="text-xl font-black text-white">{caloriePercent}%</span>
            </ProgressRing>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">
                Calorie Limit
              </span>
              <div className="text-3xl font-black text-white tracking-tight">
                {consumedCalories.toLocaleString()}
              </div>
              <p className="text-xs font-semibold text-neutral-400">
                / {targetCalories.toLocaleString()} kcal
              </p>
            </div>
          </div>

          {/* Macro Progress Bars */}
          <div className="md:col-span-5 p-5 rounded-3xl bg-black/40 border border-white/5 backdrop-blur-xl flex flex-col justify-center gap-4">
            <ProgressBar
              label="Protein"
              current={Math.round(consumedProtein)}
              target={targetProtein}
              unit="g"
              color="bg-blue-500"
            />
            <ProgressBar
              label="Carbs"
              current={Math.round(consumedCarbs)}
              target={targetCarbs}
              unit="g"
              color="bg-emerald-400"
            />
            <ProgressBar
              label="Fats"
              current={Math.round(consumedFat)}
              target={targetFat}
              unit="g"
              color="bg-amber-400"
            />
          </div>

          {/* Health Score & BMI Card */}
          <div className="md:col-span-3 p-5 rounded-3xl bg-gradient-to-br from-emerald-900/40 to-teal-900/20 border border-emerald-500/20 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-emerald-500/20 transition-all duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest">
                  Health Score
                </span>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{nutritionScore}</span>
                <span className="text-sm font-bold text-emerald-500">/100</span>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-emerald-800/30 mt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-widest block mb-0.5">BMI</span>
                <span className="text-sm font-black text-white">{bmiValue}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide ${bmiBadge.color.replace('bg-', 'bg-opacity-20 bg-').replace('text-', 'text-opacity-90 text-')} border-none bg-white/10 text-white`}>
                {bmiBadge.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ 2. Metric Overview Cards Row ━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Target */}
        <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              Daily Target
            </span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50/80 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Target className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-neutral-900 tracking-tight">
              {targetCalories.toLocaleString()}{' '}
              <span className="text-sm font-semibold text-neutral-400">kcal</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500 font-medium">Personalized BMR requirement</p>
          </div>
        </div>

        {/* Consumed */}
        <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              Consumed
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50/80 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Flame className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-neutral-900 tracking-tight">
              {consumedCalories.toLocaleString()}{' '}
              <span className="text-sm font-semibold text-neutral-400">kcal</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500 font-medium">{caloriePercent}% of daily limit</p>
          </div>
        </div>

        {/* Calories Remaining */}
        <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              Remaining
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50/80 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <TrendingDown className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-neutral-900 tracking-tight">
              {remainingCalories.toLocaleString()}{' '}
              <span className="text-sm font-semibold text-neutral-400">kcal</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500 font-medium">Available for dinner/snacks</p>
          </div>
        </div>

        {/* Hydration Indicator */}
        <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              Water Consumed
            </span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-50/80 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Droplet className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-neutral-900 tracking-tight">
              {waterCount * 250}{' '}
              <span className="text-sm font-semibold text-neutral-400">/ 2000 ml</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500 font-medium">{waterCount} of 8 glasses logged</p>
          </div>
        </div>
      </div>

      {/* ━━━ 3. Quick Actions Suite ━━━ */}
      <div className="space-y-4 mt-2">
        <h3 className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest pl-1">
          Quick Launch Tools
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/add-meal"
            className="group p-5 rounded-3xl bg-white border border-neutral-100 hover:border-emerald-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.08)] transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-neutral-900">Add Meal</h4>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">Log manual entry</p>
            </div>
          </Link>

          <Link
            to="/scan/barcode"
            className="group p-5 rounded-3xl bg-white border border-neutral-100 hover:border-teal-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(20,184,166,0.08)] transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300">
              <Barcode className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-neutral-900">Barcode Scan</h4>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">Packaged foods</p>
            </div>
          </Link>

          <Link
            to="/scan/photo"
            className="group p-5 rounded-3xl bg-white border border-neutral-100 hover:border-cyan-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(6,182,212,0.08)] transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-neutral-900">Food Vision</h4>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">Photo AI analysis</p>
            </div>
          </Link>

          <Link
            to="/chat"
            className="group p-5 rounded-3xl bg-white border border-neutral-100 hover:border-indigo-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(99,102,241,0.08)] transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-neutral-900">AI Nutritionist</h4>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">Coaching & tips</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ━━━ 4. Analytics Section: Recharts & Water Tracker ━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Nutrition Breakdown Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Macronutrient Distribution</h3>
              <p className="text-xs text-neutral-400 font-medium">Daily gram comparison against your targets</p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-full">
              Today
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Consumed" fill="#059669" radius={[6, 6, 0, 0]} maxBarSize={45} />
                <Bar dataKey="Target" fill="#e2e8f0" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Water Intake Tracker */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Droplet className="w-4.5 h-4.5 text-cyan-500 fill-cyan-500" />
                Water Tracker
              </h3>
              <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                {waterCount * 250} ml / 2000 ml
              </span>
            </div>

            <p className="text-xs text-neutral-400 mt-1 font-medium">Daily target: 8 glasses (2.0 L)</p>

            <div className="grid grid-cols-4 gap-2.5 mt-5">
              {Array.from({ length: 8 }).map((_, idx) => {
                const filled = idx < waterCount;
                return (
                  <button
                    key={idx}
                    onClick={() => setWaterCount(filled ? idx : idx + 1)}
                    title={`Glass ${idx + 1}`}
                    className={`h-11 rounded-xl flex items-center justify-center border transition-all ${
                      filled
                        ? 'bg-cyan-500 border-cyan-500 text-white shadow-2xs'
                        : 'bg-[#faf9f8] border-neutral-200/80 text-neutral-300 hover:border-cyan-300 hover:text-cyan-400'
                    }`}
                  >
                    <Droplet className={`w-4.5 h-4.5 ${filled ? 'fill-white' : ''}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-500 font-medium">{Math.round((waterCount / 8) * 100)}% Hydrated</span>
            <button
              onClick={() => setWaterCount((prev) => Math.min(8, prev + 1))}
              className="font-bold text-cyan-600 hover:text-cyan-700 transition-colors"
            >
              + Quick Add Glass
            </button>
          </div>
        </div>
      </div>

      {/* ━━━ 5. Today's Logged Meals Timeline ━━━ */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Recent Meals Logged</h3>
            <p className="text-xs text-neutral-400 font-medium">Recorded nutrition entries for today</p>
          </div>
          <Link
            to="/meals"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
          >
            Full Meal History <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {meals.length === 0 ? (
          <EmptyState
            icon={Utensils}
            title="No Meals Logged Today"
            description="Log your breakfast, lunch or snacks to track remaining calories and macro adherence."
            actionText="+ Log Your First Meal"
            onAction={() => navigate('/add-meal')}
          />
        ) : (
          <div className="divide-y divide-neutral-100">
            {meals.slice(0, 5).map((meal) => (
              <div key={meal.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200/70">
                    {meal.meal_type ? meal.meal_type[0].toUpperCase() : 'M'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{meal.meal_type || 'Meal'}</h4>
                    <p className="text-[11px] text-neutral-400 font-medium">
                      {meal.created_at || meal.date
                        ? new Date(meal.created_at || meal.date!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Logged today'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <span className="text-sm font-black text-neutral-900">{meal.total_calories || 0}</span>
                    <span className="text-xs text-neutral-400 ml-1">kcal</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
                      P: {meal.total_protein || 0}g
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60">
                      C: {meal.total_carbs || 0}g
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-semibold border border-amber-200/60">
                      F: {meal.total_fat || 0}g
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
