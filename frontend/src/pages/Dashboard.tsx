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
  Terminal,
  Cpu,
  Activity,
  Zap,
  Radio,
  Layers,
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
  const [clock, setClock] = useState<string>('');

  // Live ticking hacker timestamp
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString() + ' // ' + (now.getMilliseconds() % 999).toString().padStart(3, '0') + 'ms');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
    if (hour < 12) return { text: 'DIURNAL_CYCLE // MORNING_ONLINE', icon: Sun };
    if (hour < 18) return { text: 'SOLAR_PEAK // AFTERNOON_ONLINE', icon: Sunset };
    return { text: 'NOCTURNAL_CYCLE // EVENING_ONLINE', icon: Moon };
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

  // BMI calculation
  const { bmiValue, bmiBadge } = useMemo(() => {
    let val = profile?.bmi;
    if (!val && profile?.height_cm && profile?.weight_kg) {
      const h = profile.height_cm / 100;
      val = Number((profile.weight_kg / (h * h)).toFixed(1));
    }
    const finalVal = val || 22.4;

    const getBadge = (b: number) => {
      if (b < 18.5) return { label: 'LOW_MASS_INDEX', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' };
      if (b < 25) return { label: 'OPTIMAL_BIOMETRIC', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' };
      if (b < 30) return { label: 'MASS_SURPLUS', color: 'text-orange-400 border-orange-500/40 bg-orange-500/10' };
      return { label: 'ELEVATED_INDEX', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' };
    };

    return { bmiValue: finalVal, bmiBadge: getBadge(finalVal) };
  }, [profile]);

  // Nutrition Quality Score calculation
  const nutritionScore = useMemo(() => {
    let score = 75;
    if (consumedCalories > 0 && consumedCalories <= targetCalories) score += 10;
    if (consumedProtein >= targetProtein * 0.7) score += 10;
    if (waterCount >= 4) score += 5;
    return Math.min(96, Math.max(60, score));
  }, [consumedCalories, targetCalories, consumedProtein, targetProtein, waterCount]);

  // Recharts hacker-formatted data
  const chartData = useMemo(() => [
    { name: 'PROTEIN', Consumed: Math.round(consumedProtein), Target: targetProtein },
    { name: 'CARBS', Consumed: Math.round(consumedCarbs), Target: targetCarbs },
    { name: 'LIPIDS', Consumed: Math.round(consumedFat), Target: targetFat },
  ], [consumedProtein, targetProtein, consumedCarbs, targetCarbs, consumedFat, targetFat]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-mono text-neutral-200">
      
      {/* ━━━ TOP CYBER SYSTEM STATUS STRIP ━━━ */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#090d0a] border border-emerald-500/25 shadow-lg cyber-glow text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] uppercase">[SYSTEM_ONLINE: ROOT_ACCESS]</span>
          </div>
          <span className="hidden sm:inline text-neutral-600">//</span>
          <div className="hidden sm:flex items-center gap-2 text-neutral-400 text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-emerald-500" />
            <span>NEURAL_ENGINE: ACTIVE</span>
          </div>
          <span className="hidden md:inline text-neutral-600">//</span>
          <div className="hidden md:flex items-center gap-2 text-neutral-400 text-[11px]">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>TELEMETRY_LATENCY: 12ms</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-emerald-400/90 font-mono">
          <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
            {clock || 'UTC_TICKING // 00:00:00'}
          </span>
          {syncing ? (
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 animate-pulse">
              SYNC_IN_PROGRESS
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400">
              BUFFER_SYNCED
            </span>
          )}
        </div>
      </div>

      {/* ━━━ 1. CYBER BIOMETRIC COMMAND CORE (HERO HUD) ━━━ */}
      <div className="relative overflow-hidden rounded-3xl bg-[#080d09] border-2 border-emerald-500/30 p-6 sm:p-9 shadow-2xl transition-all cyber-glow relative">
        {/* Subtle Cyber Grid Background overlay */}
        <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
        {/* Ambient neon radial glows */}
        <div className="absolute top-[-25%] right-[-15%] w-[55%] h-[65%] rounded-full bg-emerald-500/10 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[-25%] left-[-15%] w-[45%] h-[55%] rounded-full bg-teal-500/10 blur-[80px] pointer-events-none" />

        {/* HUD Corner Tech Brackets */}
        <div className="absolute top-3 left-3 text-[10px] text-emerald-500/50 font-mono select-none">
          ┌── [NUTRI_CORE:v4.2]
        </div>
        <div className="absolute top-3 right-3 text-[10px] text-emerald-500/50 font-mono select-none">
          [CHANNEL://MAIN] ──┐
        </div>
        <div className="absolute bottom-3 left-3 text-[10px] text-emerald-500/50 font-mono select-none">
          └── [SEC_LEVEL: 0]
        </div>
        <div className="absolute bottom-3 right-3 text-[10px] text-emerald-500/50 font-mono select-none">
          [TERMINAL_READY] ──┘
        </div>

        {/* Top Header Block */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-emerald-500/20">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/40">
              <GreetingIcon className="w-4 h-4 text-emerald-400" />
              <span className="tracking-widest uppercase">{greeting.text}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white flex items-center gap-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                CYBER BIO-CORE
              </span>
              <span className="text-emerald-500 text-2xl sm:text-3xl animate-pulse">_</span>
            </h1>

            <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl font-sans leading-relaxed">
              {remainingCalories > 0 ? (
                <>
                  QUOTA_REMAINING: <span className="text-emerald-400 font-bold font-mono">{remainingCalories.toLocaleString()} KCAL</span>. 
                  Target protocol aligned for <span className="text-white font-semibold font-mono">[{profile?.health_goal || 'METABOLIC_TUNING'}]</span>.
                </>
              ) : (
                <>ENERGY_QUOTA COMPLETE // Calorie ceiling attained. Maintain hydration and cellular recovery.</>
              )}
            </p>
          </div>

          {/* Quick Hacker CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/add-meal')}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>[+ INJECT_MEAL_DATA]</span>
            </button>
            <button
              onClick={() => navigate('/diet-plan')}
              className="px-5 py-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer shadow-sm"
            >
              <Utensils className="w-4 h-4 text-emerald-400" />
              <span>[// DIET_MATRIX]</span>
            </button>
          </div>
        </div>

        {/* ━━━ CORE BIOMETRIC TELEMETRY GAUGES ━━━ */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 pt-8">
          
          {/* Caloric Fusion Progress Ring */}
          <div className="md:col-span-4 flex items-center gap-5 p-5 rounded-2xl bg-[#050806]/80 border border-emerald-500/25 backdrop-blur-md relative overflow-hidden">
            <div className="relative">
              <ProgressRing
                progress={caloriePercent}
                size={120}
                strokeWidth={10}
                color="#10b981"
                trackColor="rgba(16, 185, 129, 0.15)"
              >
                <div className="text-center">
                  <span className="text-2xl font-black text-emerald-400 font-mono block">{caloriePercent}%</span>
                  <span className="text-[9px] text-neutral-400 uppercase tracking-widest">LOADED</span>
                </div>
              </ProgressRing>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest block">
                // ENERGY_LIMIT
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
                {consumedCalories.toLocaleString()}
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">
                / {targetCalories.toLocaleString()} KCAL
              </p>
              <div className="pt-1 text-[10px] text-emerald-400/70">
                STATUS: {caloriePercent >= 100 ? 'CEILING_MAXED' : 'WITHIN_PARAMETERS'}
              </div>
            </div>
          </div>

          {/* Macro Synthesis Breakdown HUD */}
          <div className="md:col-span-5 p-5 rounded-2xl bg-[#050806]/80 border border-emerald-500/25 backdrop-blur-md flex flex-col justify-center gap-3.5">
            {/* Protein Stream */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-cyan-400 font-bold">[PROTEIN_SYNTHESIS]</span>
                <span className="text-neutral-300 font-mono">{Math.round(consumedProtein)}g / {targetProtein}g ({Math.min(100, Math.round((consumedProtein / (targetProtein || 1)) * 100))}%)</span>
              </div>
              <div className="w-full bg-neutral-900 rounded-md h-2.5 overflow-hidden border border-cyan-500/30 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-sm transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.round((consumedProtein / (targetProtein || 1)) * 100))}%` }}
                />
              </div>
            </div>

            {/* Carbs Stream */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-emerald-400 font-bold">[GLYCOGEN_CARBS]</span>
                <span className="text-neutral-300 font-mono">{Math.round(consumedCarbs)}g / {targetCarbs}g ({Math.min(100, Math.round((consumedCarbs / (targetCarbs || 1)) * 100))}%)</span>
              </div>
              <div className="w-full bg-neutral-900 rounded-md h-2.5 overflow-hidden border border-emerald-500/30 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-sm transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.round((consumedCarbs / (targetCarbs || 1)) * 100))}%` }}
                />
              </div>
            </div>

            {/* Fats Stream */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-amber-400 font-bold">[LIPID_RESERVES]</span>
                <span className="text-neutral-300 font-mono">{Math.round(consumedFat)}g / {targetFat}g ({Math.min(100, Math.round((consumedFat / (targetFat || 1)) * 100))}%)</span>
              </div>
              <div className="w-full bg-neutral-900 rounded-md h-2.5 overflow-hidden border border-amber-500/30 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-sm transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.round((consumedFat / (targetFat || 1)) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Biometric Score Radar */}
          <div className="md:col-span-3 p-5 rounded-2xl bg-[#050806]/80 border border-emerald-500/25 backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  BIO_INDEX
                </span>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-black text-white font-mono">{nutritionScore}</span>
                <span className="text-xs font-bold text-emerald-500">/ 100</span>
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-500/20 mt-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">BMI_VECTOR</span>
                <span className="text-sm font-black text-white font-mono">{bmiValue}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide border ${bmiBadge.color}`}>
                {bmiBadge.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ 2. FOUR CYBER TELEMETRY PODS ━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* POD 1: Quota */}
        <div className="bg-[#090d0a] rounded-2xl p-4.5 border border-emerald-500/25 hover:border-emerald-400 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest">
              // POD_01: QUOTA
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white tracking-tight font-mono">
              {targetCalories.toLocaleString()}{' '}
              <span className="text-xs font-semibold text-emerald-400/80">KCAL</span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-400 font-sans">Daily baseline requirement</p>
          </div>
        </div>

        {/* POD 2: Consumed */}
        <div className="bg-[#090d0a] rounded-2xl p-4.5 border border-emerald-500/25 hover:border-emerald-400 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest">
              // POD_02: CONSUMED
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-400 tracking-tight font-mono">
              {consumedCalories.toLocaleString()}{' '}
              <span className="text-xs font-semibold text-neutral-400">KCAL</span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-400 font-sans">{caloriePercent}% of daily ceiling</p>
          </div>
        </div>

        {/* POD 3: Deficit */}
        <div className="bg-[#090d0a] rounded-2xl p-4.5 border border-emerald-500/25 hover:border-amber-400 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-400/80 uppercase tracking-widest">
              // POD_03: DELTA_REMAIN
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-amber-400 tracking-tight font-mono">
              {remainingCalories.toLocaleString()}{' '}
              <span className="text-xs font-semibold text-neutral-400">KCAL</span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-400 font-sans">Available metabolic allocation</p>
          </div>
        </div>

        {/* POD 4: Hydration */}
        <div className="bg-[#090d0a] rounded-2xl p-4.5 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-cyan-400/80 uppercase tracking-widest">
              // POD_04: FLUID_CELLS
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Droplet className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-cyan-400 tracking-tight font-mono">
              {waterCount * 250}{' '}
              <span className="text-xs font-semibold text-neutral-400">/ 2000 ML</span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-400 font-sans">{waterCount} of 8 bio-cells filled</p>
          </div>
        </div>
      </div>

      {/* ━━━ 3. HACKER COMMAND MODULES (QUICK LAUNCH) ━━━ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            TACTICAL_COMMAND_MODULES
          </span>
          <span className="text-[10px] text-neutral-500">// SELECT_EXECUTION_TARGET</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/add-meal"
            className="p-4 rounded-2xl bg-[#090d0a] border border-emerald-500/25 hover:border-emerald-400 hover:bg-[#0d140f] transition-all duration-300 hover:-translate-y-1 flex flex-col gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-black transition-all">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-500/70 font-mono block">MOD_01</span>
              <h4 className="text-xs font-black text-white uppercase tracking-tight">MANUAL_INJECT</h4>
              <p className="text-[11px] text-neutral-400 font-sans mt-0.5">Log custom food specs</p>
            </div>
          </Link>

          <Link
            to="/scan/barcode"
            className="p-4 rounded-2xl bg-[#090d0a] border border-teal-500/25 hover:border-teal-400 hover:bg-[#091411] transition-all duration-300 hover:-translate-y-1 flex flex-col gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-black transition-all">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-teal-500/70 font-mono block">MOD_02</span>
              <h4 className="text-xs font-black text-white uppercase tracking-tight">BARCODE_DECODER</h4>
              <p className="text-[11px] text-neutral-400 font-sans mt-0.5">50-slot verified registry</p>
            </div>
          </Link>

          <Link
            to="/scan/photo"
            className="p-4 rounded-2xl bg-[#090d0a] border border-cyan-500/25 hover:border-cyan-400 hover:bg-[#071317] transition-all duration-300 hover:-translate-y-1 flex flex-col gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black transition-all">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-cyan-500/70 font-mono block">MOD_03</span>
              <h4 className="text-xs font-black text-white uppercase tracking-tight">OPTICAL_VISION_AI</h4>
              <p className="text-[11px] text-neutral-400 font-sans mt-0.5">Photo neural analysis</p>
            </div>
          </Link>

          <Link
            to="/chat"
            className="p-4 rounded-2xl bg-[#090d0a] border border-indigo-500/25 hover:border-indigo-400 hover:bg-[#0d0f1a] transition-all duration-300 hover:-translate-y-1 flex flex-col gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-indigo-400/70 font-mono block">MOD_04</span>
              <h4 className="text-xs font-black text-white uppercase tracking-tight">NEURAL_ADVISOR</h4>
              <p className="text-[11px] text-neutral-400 font-sans mt-0.5">AI nutritionist coaching</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ━━━ 4. MACRO SPECTRUM & HYDRATION CELL MATRIX ━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recharts Hacker Spectrum */}
        <div className="lg:col-span-8 bg-[#080d09] rounded-3xl border border-emerald-500/25 p-5 sm:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>// MACRO_SPECTRUM_DISTRIBUTION</span>
              </h3>
              <p className="text-[11px] text-neutral-400 font-sans mt-0.5">Real-time gram tracking vs target envelope</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 border border-emerald-500/40 text-emerald-400 rounded">
              DIURNAL_WINDOW
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(16, 185, 129, 0.1)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#10b981', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#050806',
                    borderRadius: '10px',
                    border: '1px solid #10b981',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: '#e5e7eb',
                    boxShadow: '0 0 15px rgba(16,185,129,0.3)',
                  }}
                />
                <Legend iconType="square" wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontFamily: 'monospace' }} />
                <Bar dataKey="Consumed" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={45} />
                <Bar dataKey="Target" fill="rgba(255,255,255,0.15)" radius={[4, 4, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interactive Fluid Injector */}
        <div className="lg:col-span-4 bg-[#080d09] rounded-3xl border border-cyan-500/25 p-5 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Droplet className="w-4 h-4 text-cyan-400" />
                <span>// HYDRATION_ARRAY</span>
              </h3>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
                {waterCount * 250} / 2000 ML
              </span>
            </div>

            <p className="text-[11px] text-neutral-400 mt-2 font-sans">
              8-Stage Cellular Hydration Matrix. Click cells to toggle status.
            </p>

            <div className="grid grid-cols-4 gap-2.5 mt-4">
              {Array.from({ length: 8 }).map((_, idx) => {
                const filled = idx < waterCount;
                return (
                  <button
                    key={idx}
                    onClick={() => setWaterCount(filled ? idx : idx + 1)}
                    title={`Toggle Cell #${idx + 1}`}
                    className={`h-11 rounded-xl flex items-center justify-center border font-mono text-xs transition-all active:scale-90 cursor-pointer ${
                      filled
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-600 hover:border-cyan-500/40 hover:text-cyan-400'
                    }`}
                  >
                    <Droplet className={`w-4 h-4 ${filled ? 'fill-cyan-400 text-cyan-400' : ''}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-cyan-500/20 flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400/80">EFFICIENCY: {Math.round((waterCount / 8) * 100)}%</span>
            <button
              onClick={() => setWaterCount((prev) => Math.min(8, prev + 1))}
              className="text-cyan-300 hover:text-cyan-200 font-bold flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              [+ INJECT_CELL]
            </button>
          </div>
        </div>
      </div>

      {/* ━━━ 5. TERMINAL AUDIT FEED (RECENT MEALS) ━━━ */}
      <div className="bg-[#050806] rounded-3xl border border-emerald-500/30 p-5 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            {/* Terminal Window Dots */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>root@nutri-ai:~# tail -f /var/log/nutrition.log</span>
              </h3>
            </div>
          </div>
          
          <Link
            to="/meals"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono transition-colors"
          >
            [VIEW_FULL_LOGS <ArrowUpRight className="w-3.5 h-3.5" />]
          </Link>
        </div>

        {meals.length === 0 ? (
          <div className="p-8 text-center bg-neutral-950/60 rounded-2xl border border-emerald-500/15 space-y-3">
            <Terminal className="w-8 h-8 text-emerald-500/40 mx-auto animate-pulse" />
            <p className="text-xs text-emerald-400/80 font-mono">
              [LOG_BUFFER_EMPTY] No nutritional packets recorded in current diurnal cycle.
            </p>
            <p className="text-[11px] text-neutral-500 font-sans max-w-md mx-auto">
              Execute your first food entry via Manual Input, Barcode Decoder, or Computer Vision Recon.
            </p>
            <button
              onClick={() => navigate('/add-meal')}
              className="mt-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs transition-all active:scale-95 cursor-pointer"
            >
              [+ EXECUTE_ENTRY]
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {meals.slice(0, 5).map((meal, idx) => (
              <div 
                key={meal.id} 
                className="p-3 rounded-xl bg-neutral-950/70 border border-emerald-500/15 hover:border-emerald-500/40 flex flex-wrap items-center justify-between gap-3 transition-colors text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className="text-emerald-500/50 text-[10px]">#{idx + 1}</span>
                  <div className="w-7 h-7 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    {meal.meal_type ? meal.meal_type[0].toUpperCase() : 'M'}
                  </div>
                  <div>
                    <span className="font-bold text-white uppercase">{meal.meal_type || 'FOOD_PACKET'}</span>
                    <span className="text-[10px] text-neutral-500 ml-2">
                      {meal.created_at || meal.date
                        ? new Date(meal.created_at || meal.date!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'TIMESTAMP_RECORDED'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-emerald-400 font-bold">
                    +{meal.total_calories || 0} KCAL
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                      P:{meal.total_protein || 0}g
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                      C:{meal.total_carbs || 0}g
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">
                      F:{meal.total_fat || 0}g
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
