// frontend/src/pages/MoodTracking.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Smile,
  Heart,
  Calendar,
  Sparkles,
  TrendingUp,
  BarChart2,
  BookOpen,
  Utensils,
  AlertCircle,
  CheckCircle2,
  Tag,
  Clock,
  Trash2,
  Edit3,
  X,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Cell,
} from 'recharts';
import api from '../api/axios';
import { moodService } from '../api/moodService';
import type {
  MoodEntry,
  MoodAnalytics,
  FoodMoodConnectionData,
  AIInsightsResponse,
  TextAnalysisResponse,
} from '../api/moodService';

interface MoodMeta {
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
}

const MOOD_OPTIONS: MoodMeta[] = [
  { label: 'Happy', emoji: '😊', color: '#10b981', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30', borderColor: 'border-emerald-300 dark:border-emerald-700', textColor: 'text-emerald-700 dark:text-emerald-400', description: 'Upbeat, joyful, pleased' },
  { label: 'Calm', emoji: '😌', color: '#0d9488', bgColor: 'bg-teal-50 dark:bg-teal-950/30', borderColor: 'border-teal-300 dark:border-teal-700', textColor: 'text-teal-700 dark:text-teal-400', description: 'Peaceful, relaxed, centered' },
  { label: 'Energetic', emoji: '⚡', color: '#f59e0b', bgColor: 'bg-amber-50 dark:bg-amber-950/30', borderColor: 'border-amber-300 dark:border-amber-700', textColor: 'text-amber-700 dark:text-amber-400', description: 'Motivated, active, dynamic' },
  { label: 'Neutral', emoji: '😐', color: '#64748b', bgColor: 'bg-slate-50 dark:bg-slate-900/50', borderColor: 'border-slate-300 dark:border-slate-700', textColor: 'text-slate-700 dark:text-slate-300', description: 'Steady, ordinary, balanced' },
  { label: 'Sad', emoji: '😢', color: '#3b82f6', bgColor: 'bg-blue-50 dark:bg-blue-950/30', borderColor: 'border-blue-300 dark:border-blue-700', textColor: 'text-blue-700 dark:text-blue-400', description: 'Low, sorrowful, down' },
  { label: 'Stressed', emoji: '😫', color: '#f43f5e', bgColor: 'bg-rose-50 dark:bg-rose-950/30', borderColor: 'border-rose-300 dark:border-rose-700', textColor: 'text-rose-700 dark:text-rose-400', description: 'Overwhelmed, tense, pressured' },
  { label: 'Anxious', emoji: '😰', color: '#8b5cf6', bgColor: 'bg-purple-50 dark:bg-purple-950/30', borderColor: 'border-purple-300 dark:border-purple-700', textColor: 'text-purple-700 dark:text-purple-400', description: 'Worried, restless, uneasy' },
  { label: 'Tired', emoji: '🥱', color: '#6366f1', bgColor: 'bg-indigo-50 dark:bg-indigo-950/30', borderColor: 'border-indigo-300 dark:border-indigo-700', textColor: 'text-indigo-700 dark:text-indigo-400', description: 'Fatigued, sleepy, drained' },
  { label: 'Frustrated', emoji: '😤', color: '#ea580c', bgColor: 'bg-orange-50 dark:bg-orange-950/30', borderColor: 'border-orange-300 dark:border-orange-700', textColor: 'text-orange-700 dark:text-orange-400', description: 'Annoyed, irritated, stuck' },
];

const PREDEFINED_TAGS = [
  'study',
  'work',
  'sleep',
  'exercise',
  'social interaction',
  'hunger',
  'cravings',
  'relaxation',
  'family',
  'nature',
];

const DURATION_OPTIONS = [
  '< 1 hour',
  '1-3 hours',
  'Half day',
  'All day',
  'Several days',
];

const HUNGER_OPTIONS = ['None', 'Low', 'Moderate', 'High', 'Ravenous'];
const CRAVING_OPTIONS = ['None', 'Sweets', 'Salty', 'Savory', 'Carbs'];

export const MoodTracking: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checkin' | 'history' | 'analytics' | 'food' | 'ai'>('checkin');

  // Form states
  const [selectedMood, setSelectedMood] = useState<string>('Happy');
  const [intensity, setIntensity] = useState<number>(3);
  const [duration, setDuration] = useState<string>('1-3 hours');
  const [selectedTags, setSelectedTags] = useState<string[]>(['study']);
  const [customTagInput, setCustomTagInput] = useState<string>('');
  const [journalNote, setJournalNote] = useState<string>('');
  const [selectedMealId, setSelectedMealId] = useState<number | undefined>(undefined);
  const [hungerLevel, setHungerLevel] = useState<string>('Moderate');
  const [cravings, setCravings] = useState<string>('None');
  const [waterIntake, setWaterIntake] = useState<number>(4);
  const [sleepHours, setSleepHours] = useState<number>(7.5);

  // Loading & notice states
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // History states
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState<boolean>(false);
  const [filterMood, setFilterMood] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<'all' | '7days' | '30days'>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Edit modal state
  const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Analytics states
  const [analytics, setAnalytics] = useState<MoodAnalytics | null>(null);
  const [analyticsDays, setAnalyticsDays] = useState<number>(30);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(false);

  // Food & Mood state
  const [foodConnection, setFoodConnection] = useState<FoodMoodConnectionData | null>(null);
  const [loadingFoodConn, setLoadingFoodConn] = useState<boolean>(false);

  // AI Insights state
  const [aiInsights, setAiInsights] = useState<AIInsightsResponse | null>(null);
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [aiDays, setAiDays] = useState<number>(14);

  // Text Analysis state ("Analyze my journal")
  const [analyzingText, setAnalyzingText] = useState<boolean>(false);
  const [textAnalysisResult, setTextAnalysisResult] = useState<TextAnalysisResponse | null>(null);

  // Available meals for linking
  const [availableMeals, setAvailableMeals] = useState<Array<{ id: number; meal_type?: string; date?: string; total_calories?: number }>>([]);

  // Fetch entries
  const fetchEntries = useCallback(async () => {
    setLoadingEntries(true);
    try {
      const params: any = { limit: 100 };
      if (filterMood !== 'all') params.mood = filterMood;
      if (filterDateRange === '7days') {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        params.start_date = d.toISOString().split('T')[0];
      } else if (filterDateRange === '30days') {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        params.start_date = d.toISOString().split('T')[0];
      }
      const data = await moodService.getMoods(params);
      setEntries(data || []);
    } catch (err: any) {
      console.error('Failed to load mood entries:', err);
    } finally {
      setLoadingEntries(false);
    }
  }, [filterMood, filterDateRange]);

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    setLoadingAnalytics(true);
    try {
      const data = await moodService.getAnalytics(analyticsDays);
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  }, [analyticsDays]);

  // Fetch food connection
  const fetchFoodConnection = useCallback(async () => {
    setLoadingFoodConn(true);
    try {
      const data = await moodService.getFoodMoodConnection(30);
      setFoodConnection(data);
    } catch (err) {
      console.error('Failed to load food connection:', err);
    } finally {
      setLoadingFoodConn(false);
    }
  }, []);

  // Fetch recent user meals for linking dropdown
  useEffect(() => {
    api.get('/meals/', { params: { limit: 10 } })
      .then(res => {
        if (Array.isArray(res.data)) {
          setAvailableMeals(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Sync data on tab change
  useEffect(() => {
    if (activeTab === 'history') {
      fetchEntries();
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
    } else if (activeTab === 'food') {
      fetchFoodConnection();
    }
  }, [activeTab, fetchEntries, fetchAnalytics, fetchFoodConnection]);

  // Initial load of entries for today's status bar
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Today's latest check-in
  const todaysLatestEntry = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return entries.find(e => e.date && e.date.startsWith(todayStr));
  }, [entries]);

  // Tag toggler
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const cleaned = customTagInput.trim().toLowerCase();
    if (cleaned && !selectedTags.includes(cleaned)) {
      setSelectedTags(prev => [...prev, cleaned]);
      setCustomTagInput('');
    }
  };

  // Handle Save Check-in
  const handleSaveCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setFormError(null);
    setFormSuccess(null);

    if (!selectedMood) {
      setFormError('Please select a primary mood.');
      return;
    }

    setSubmitting(true);
    try {
      await moodService.createMood({
        mood: selectedMood,
        intensity,
        duration,
        tags: selectedTags,
        journal_note: journalNote.trim() || undefined,
        meal_id: selectedMealId,
        hunger_level: hungerLevel,
        cravings: cravings,
        water_intake: waterIntake,
        sleep_hours: sleepHours,
      });

      setFormSuccess('Mood check-in saved successfully!');
      setJournalNote('');
      setTextAnalysisResult(null);
      fetchEntries();

      setTimeout(() => setFormSuccess(null), 3500);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.detail || 'Failed to save mood check-in. Please try again.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Text-Based Emotion Analysis
  const handleAnalyzeJournalText = async () => {
    if (!journalNote.trim() || journalNote.trim().length < 3) {
      setFormError('Please enter at least a few words in your journal before analyzing.');
      return;
    }

    setAnalyzingText(true);
    setFormError(null);
    try {
      const res = await moodService.analyzeText(journalNote);
      setTextAnalysisResult(res);
    } catch (err: any) {
      console.error(err);
      setFormError('Journal analysis is temporarily unavailable. You can still save your chosen mood.');
    } finally {
      setAnalyzingText(false);
    }
  };

  // Handle Delete Entry
  const handleDeleteEntry = async (id: number) => {
    try {
      await moodService.deleteMood(id);
      setDeleteConfirmId(null);
      fetchEntries();
    } catch (err) {
      console.error('Failed to delete entry:', err);
    }
  };

  // Handle Update Entry
  const handleUpdateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    try {
      await moodService.updateMood(editingEntry.id, {
        mood: editingEntry.mood,
        intensity: editingEntry.intensity,
        duration: editingEntry.duration,
        tags: editingEntry.tags,
        journal_note: editingEntry.journal_note,
        hunger_level: editingEntry.hunger_level,
        cravings: editingEntry.cravings,
      });
      setEditingEntry(null);
      fetchEntries();
    } catch (err) {
      console.error('Failed to update entry:', err);
    }
  };

  // Generate AI Insights
  const handleGenerateAIInsights = async () => {
    setLoadingAI(true);
    try {
      const data = await moodService.getAIInsights(aiDays);
      setAiInsights(data);
    } catch (err) {
      console.error('Failed to generate AI insights:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  // Filtered entries for search
  const displayedEntries = useMemo(() => {
    if (!searchFilter.trim()) return entries;
    const q = searchFilter.toLowerCase();
    return entries.filter(e =>
      e.mood.toLowerCase().includes(q) ||
      (e.journal_note && e.journal_note.toLowerCase().includes(q)) ||
      (e.tags && e.tags.some(t => t.toLowerCase().includes(q)))
    );
  }, [entries, searchFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* ━━━ Header & Quick Stats ━━━ */}
      <div className="bg-white dark:bg-neutral-900 p-6 sm:p-7 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-xs font-bold border border-emerald-200/80 dark:border-emerald-800/60 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Emotional Well-being Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
              Emotion & Mood Tracking
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
              Daily emotional check-ins, reflective private journaling, longitudinal mood analytics, and nutritional wellness connections.
            </p>
          </div>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-[#faf9f8] dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 text-left">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Today's Status</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {todaysLatestEntry ? (
                  <>
                    <span className="text-base">{MOOD_OPTIONS.find(m => m.label === todaysLatestEntry.mood)?.emoji || '✨'}</span>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">{todaysLatestEntry.mood}</span>
                  </>
                ) : (
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Pending Check-in</span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#faf9f8] dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 text-left">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Total Recorded</span>
              <span className="text-base font-black text-neutral-900 dark:text-white mt-0.5 block">
                {entries.length} check-in{entries.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-[#faf9f8] dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 text-left">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Privacy Isolation</span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Isolated & Encrypted
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-6 overflow-x-auto pb-1 border-t border-neutral-100 dark:border-neutral-800 pt-4 scrollbar-none">
          <button
            onClick={() => setActiveTab('checkin')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'checkin'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-[#faf9f8] dark:hover:bg-neutral-800'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span>Today's Check-in</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-[#faf9f8] dark:hover:bg-neutral-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>History & Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-[#faf9f8] dark:hover:bg-neutral-800'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Mood Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('food')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'food'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-[#faf9f8] dark:hover:bg-neutral-800'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Food & Wellness Connection</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-[#faf9f8] dark:hover:bg-neutral-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Mood Insights</span>
          </button>
        </div>
      </div>

      {/* ━━━ TAB 1: Today's Check-in & Journal ━━━ */}
      {activeTab === 'checkin' && (
        <form onSubmit={handleSaveCheckin} className="space-y-6">
          {formSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 flex items-center gap-3 text-rose-800 dark:text-rose-300 text-xs font-bold animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section A: Today's Mood Check-in */}
          <div className="bg-white dark:bg-neutral-900 p-6 sm:p-7 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 gap-2">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                  How are you feeling right now?
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Select one primary mood that best reflects your current emotional state.
                </p>
              </div>
              <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 bg-[#faf9f8] dark:bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60 w-fit">
                📅 {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            {/* 9 Mood Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2.5">
              {MOOD_OPTIONS.map((m) => {
                const isSelected = selectedMood.toLowerCase() === m.label.toLowerCase();
                return (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => setSelectedMood(m.label)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? `${m.bgColor} ${m.borderColor} ring-2 ring-emerald-500/30 scale-102 shadow-2xs`
                        : 'bg-white dark:bg-neutral-800/40 border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl filter drop-shadow-xs">{m.emoji}</span>
                    <span className={`text-xs font-bold truncate max-w-full ${isSelected ? m.textColor : 'text-neutral-800 dark:text-neutral-200'}`}>
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Intensity & Duration Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Mood Intensity Slider (1-5) */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#faf9f8] dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/60">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Mood Intensity (1 to 5)</span>
                  </label>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    Level {intensity} &bull; {['Mild', 'Light', 'Moderate', 'Strong', 'Intense'][intensity - 1]}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={intensity}
                  onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-semibold text-neutral-400">
                  <span>1 (Mild)</span>
                  <span>2 (Light)</span>
                  <span>3 (Moderate)</span>
                  <span>4 (Strong)</span>
                  <span>5 (Intense)</span>
                </div>
              </div>

              {/* Duration Selector */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#faf9f8] dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/60">
                <label className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>How long have you felt this way? (Optional)</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {DURATION_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`px-2 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                        duration === d
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                          : 'bg-white dark:bg-neutral-800 border-neutral-200/80 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Context Tags Selection */}
            <div className="space-y-2.5 pt-2">
              <label className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Context Tags (Optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_TAGS.map((tag) => {
                  const isChecked = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300'
                          : 'bg-[#faf9f8] dark:bg-neutral-800/60 border-neutral-200/80 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>

              {/* Custom Tag Input */}
              <div className="flex items-center gap-2 pt-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Add custom tag (e.g. exams, gym)..."
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={handleAddCustomTag}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#faf9f8] dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 focus:outline-none focus:border-emerald-500 font-medium text-neutral-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 text-xs font-bold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Section B: Private Emotion Journal */}
          <div className="bg-white dark:bg-neutral-900 p-6 sm:p-7 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Private Emotion Journal</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Record what happened, what influenced how you feel, or any reflections.
                </p>
              </div>
              <span className="text-[11px] font-mono font-semibold text-neutral-400">
                {journalNote.length} / 3000
              </span>
            </div>

            <textarea
              rows={4}
              placeholder="What's on your mind today? What triggered this emotion or influenced your day? (Optional)..."
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              maxLength={3000}
              className="w-full p-4 text-xs sm:text-sm rounded-2xl bg-[#faf9f8] dark:bg-neutral-800/70 border border-neutral-200/80 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium resize-y"
            />

            {/* Optional AI Text-Based Emotion Analysis ("Analyze my journal") */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleAnalyzeJournalText}
                disabled={analyzingText || journalNote.trim().length < 3}
                className="px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800 text-teal-800 dark:text-teal-300 hover:bg-teal-100 text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer w-fit"
              >
                {analyzingText ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-teal-600" />}
                <span>Analyze my journal</span>
              </button>

              <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
                🔒 Stored securely in your private database account. Never shared.
              </span>
            </div>

            {/* AI Text Analysis Result Box */}
            {textAnalysisResult && (
              <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-950 dark:text-teal-200">
                      Observed Theme Analysis
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-100 text-teal-800">
                      {textAnalysisResult.confidence_label}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTextAnalysisResult(null)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-neutral-700 dark:text-neutral-300">
                  {textAnalysisResult.explanation}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Suggested mood:</span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-white dark:bg-neutral-800 border border-teal-200 text-teal-900 dark:text-teal-300">
                    {textAnalysisResult.suggested_mood}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedMood(textAnalysisResult.suggested_mood)}
                    className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
                  >
                    Use as my primary mood
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {textAnalysisResult.emotional_themes.map((th, i) => (
                    <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      &bull; {th}
                    </span>
                  ))}
                </div>

                <p className="text-[10px] text-teal-700/80 dark:text-teal-400/80 pt-1 italic">
                  {textAnalysisResult.disclaimer}
                </p>
              </div>
            )}
          </div>

          {/* Section 4: Optional Meal & Wellness Linking */}
          <div className="bg-white dark:bg-neutral-900 p-6 sm:p-7 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-600" />
              <span>Link Meals & Nutrition Context (Optional)</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Correlate your emotional state with recent nourishment, cravings, and physiological habits.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
              {/* Linked Meal */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Associated Meal
                </label>
                <select
                  value={selectedMealId || ''}
                  onChange={(e) => setSelectedMealId(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                  className="w-full p-2.5 text-xs rounded-xl bg-[#faf9f8] dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium focus:outline-none"
                >
                  <option value="">None / Not linked</option>
                  {availableMeals.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.meal_type || 'Meal'} ({Math.round(m.total_calories || 0)} kcal)
                    </option>
                  ))}
                </select>
              </div>

              {/* Hunger Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Hunger Level
                </label>
                <select
                  value={hungerLevel}
                  onChange={(e) => setHungerLevel(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-[#faf9f8] dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium focus:outline-none"
                >
                  {HUNGER_OPTIONS.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              {/* Cravings */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Cravings
                </label>
                <select
                  value={cravings}
                  onChange={(e) => setCravings(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-[#faf9f8] dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium focus:outline-none"
                >
                  {CRAVING_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Sleep & Hydration */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                  <span>Sleep (hrs)</span>
                  <span className="text-[10px] text-neutral-400">Water: {waterIntake} gl</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(parseFloat(e.target.value) || 0)}
                    className="w-1/2 p-2.5 text-xs rounded-xl bg-[#faf9f8] dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 font-medium"
                    placeholder="7.5"
                  />
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={waterIntake}
                    onChange={(e) => setWaterIntake(parseInt(e.target.value, 10) || 0)}
                    className="w-1/2 p-2.5 text-xs rounded-xl bg-[#faf9f8] dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 font-medium"
                    placeholder="Water"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Actions Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Save Mood Check-in</span>
            </button>
          </div>
        </form>
      )}

      {/* ━━━ TAB 2: Mood History & Calendar ━━━ */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </div>

              {/* Mood Filter */}
              <select
                value={filterMood}
                onChange={(e) => setFilterMood(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-[#faf9f8] dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-none"
              >
                <option value="all">All Moods</option>
                {MOOD_OPTIONS.map((m) => (
                  <option key={m.label} value={m.label.toLowerCase()}>
                    {m.emoji} {m.label}
                  </option>
                ))}
              </select>

              {/* Date Filter */}
              <select
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value as any)}
                className="px-3 py-1.5 text-xs rounded-xl bg-[#faf9f8] dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-none"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
            </div>

            {/* Keyword Search */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notes or tags..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#faf9f8] dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* History Records List */}
          {loadingEntries ? (
            <div className="p-12 text-center text-xs font-bold text-neutral-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Loading mood check-ins from database...</span>
            </div>
          ) : displayedEntries.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 p-12 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 text-center space-y-3">
              <Smile className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto" />
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">No mood entries found</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                {searchFilter || filterMood !== 'all'
                  ? 'No check-ins match your current filter criteria. Try resetting filters.'
                  : 'You have not recorded any mood check-ins yet. Log your feelings to start visualizing patterns.'}
              </p>
              <button
                onClick={() => { setActiveTab('checkin'); setFilterMood('all'); setSearchFilter(''); }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Record Today's Mood
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedEntries.map((item) => {
                const meta = MOOD_OPTIONS.find(m => m.label.toLowerCase() === item.mood.toLowerCase()) || MOOD_OPTIONS[0];
                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3 hover:border-emerald-300 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{meta.emoji}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white">
                                {item.mood}
                              </h4>
                              {item.intensity && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#faf9f8] dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700">
                                  Intensity {item.intensity}/5
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-medium text-neutral-400">
                              {item.date ? new Date(item.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Recorded'}
                            </span>
                          </div>
                        </div>

                        {/* Edit & Delete Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingEntry(item)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            title="Edit Check-in"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            title="Delete Check-in"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Journal Note */}
                      {item.journal_note && (
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 bg-[#faf9f8] dark:bg-neutral-800/60 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 italic">
                          &ldquo;{item.journal_note}&rdquo;
                        </p>
                      )}

                      {/* Linked Meal */}
                      {item.meal && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-800 dark:text-teal-300 bg-teal-50/70 dark:bg-teal-950/30 px-2.5 py-1 rounded-lg border border-teal-200/80 w-fit">
                          <Utensils className="w-3 h-3 text-teal-600" />
                          <span>Linked Meal: {item.meal.meal_type} ({Math.round(item.meal.total_calories || 0)} kcal)</span>
                        </div>
                      )}

                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.tags.map(t => (
                            <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Metadata Footer */}
                    <div className="flex items-center justify-between text-[10px] font-medium text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <span>Duration: {item.duration || 'Not recorded'}</span>
                      {item.hunger_level && <span>Hunger: {item.hunger_level}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirmId !== null && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-neutral-900 max-w-sm w-full p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xl">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div className="text-center space-y-1">
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white">Delete Mood Check-in?</h4>
                  <p className="text-xs text-neutral-500">
                    This action will permanently remove this private check-in record from your database history.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 py-2 text-xs font-bold rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(deleteConfirmId)}
                    className="flex-1 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Entry Modal */}
          {editingEntry && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <form onSubmit={handleUpdateEntry} className="bg-white dark:bg-neutral-900 max-w-md w-full p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white">Edit Mood Check-in</h4>
                  <button type="button" onClick={() => setEditingEntry(null)} className="text-neutral-400 hover:text-neutral-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">Primary Mood</label>
                    <select
                      value={editingEntry.mood}
                      onChange={(e) => setEditingEntry({ ...editingEntry, mood: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-xl bg-[#faf9f8] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                    >
                      {MOOD_OPTIONS.map(m => (
                        <option key={m.label} value={m.label}>{m.emoji} {m.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Intensity (1 to 5): {editingEntry.intensity || 3}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={editingEntry.intensity || 3}
                      onChange={(e) => setEditingEntry({ ...editingEntry, intensity: parseInt(e.target.value, 10) })}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">Private Journal Note</label>
                    <textarea
                      rows={3}
                      value={editingEntry.journal_note || ''}
                      onChange={(e) => setEditingEntry({ ...editingEntry, journal_note: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-xl bg-[#faf9f8] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setEditingEntry(null)}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-neutral-200 dark:border-neutral-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ━━━ TAB 3: Mood Analytics ━━━ */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Analytics Header & Range Selector */}
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-600" />
                <span>Longitudinal Mood Analytics</span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Computed strictly from authenticated database records.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              {[7, 14, 30, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setAnalyticsDays(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    analyticsDays === d
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                      : 'bg-[#faf9f8] dark:bg-neutral-800 border-neutral-200/80 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  Last {d} Days
                </button>
              ))}
            </div>
          </div>

          {loadingAnalytics ? (
            <div className="p-12 text-center text-xs font-bold text-neutral-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Analyzing historical records...</span>
            </div>
          ) : !analytics || analytics.total_checkins === 0 ? (
            <div className="bg-white dark:bg-neutral-900 p-12 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 text-center space-y-3">
              <BarChart2 className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto" />
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Insufficient Analytics Data</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No mood check-ins have been recorded in the selected {analyticsDays}-day period yet. Complete check-ins to generate distribution and intensity charts.
              </p>
              <button
                onClick={() => setActiveTab('checkin')}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Log Today's Mood
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Total Check-ins</span>
                  <span className="text-2xl font-black text-neutral-900 dark:text-white mt-1 block">
                    {analytics.total_checkins}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Across {analyticsDays} days</span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Average Intensity</span>
                  <span className="text-2xl font-black text-neutral-900 dark:text-white mt-1 block">
                    {analytics.average_intensity !== null && analytics.average_intensity !== undefined ? `${analytics.average_intensity} / 5` : 'N/A'}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-semibold mt-1 block">Self-reported rating</span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Most Frequent Mood</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xl">
                      {MOOD_OPTIONS.find(m => m.label === analytics.most_frequent_mood)?.emoji || '✨'}
                    </span>
                    <span className="text-base font-black text-neutral-900 dark:text-white">
                      {analytics.most_frequent_mood || 'N/A'}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-medium mt-1 block">Top reported category</span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Top Context Tag</span>
                  <span className="text-lg font-black text-emerald-700 dark:text-emerald-400 mt-1 block">
                    {analytics.top_tags && analytics.top_tags.length > 0 ? `#${analytics.top_tags[0].tag}` : 'None'}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-medium mt-1 block">
                    {analytics.top_tags && analytics.top_tags.length > 0 ? `${analytics.top_tags[0].count} mentions` : 'No tags yet'}
                  </span>
                </div>
              </div>

              {/* Chart 1: Mood Distribution */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Mood Distribution</h3>
                  <p className="text-xs text-neutral-500">Frequency of each reported primary mood during the lookback period.</p>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={Object.entries(analytics.mood_distribution).map(([name, count]) => ({
                        name,
                        count,
                        color: MOOD_OPTIONS.find(m => m.label === name)?.color || '#10b981',
                      }))}
                      margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" interval={0} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {Object.keys(analytics.mood_distribution).map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={MOOD_OPTIONS[index % MOOD_OPTIONS.length]?.color || '#10b981'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Intensity Trend Over Time */}
              {analytics.intensity_trends && analytics.intensity_trends.length > 1 && (
                <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Daily Mood Intensity Trend</h3>
                    <p className="text-xs text-neutral-500">Average reported intensity on a 1-5 scale over time.</p>
                  </div>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analytics.intensity_trends}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }} />
                        <Line
                          type="monotone"
                          dataKey="average_intensity"
                          stroke="#059669"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#059669' }}
                          name="Avg Intensity"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ━━━ TAB 4: Food & Mood Connection ━━━ */}
      {activeTab === 'food' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 p-6 sm:p-7 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-200 mb-2">
                <Utensils className="w-3.5 h-3.5 text-teal-600" />
                <span>Nutritional Behavioral Correlation</span>
              </div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Food & Mood Wellness Connection
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Comparing self-reported emotional check-ins with logged meal calories and hunger signals.
              </p>
            </div>

            {loadingFoodConn ? (
              <div className="p-12 text-center text-xs font-bold text-neutral-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
                <span>Correlating food logs and mood data...</span>
              </div>
            ) : !foodConnection || foodConnection.total_moods_analyzed === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500 space-y-2">
                <p>No food or mood records available to correlate yet.</p>
                <p className="text-[11px] text-neutral-400">Log both meals and emotions to generate longitudinal connection patterns.</p>
              </div>
            ) : (
              <div className="space-y-6 pt-2">
                {/* Metric Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#faf9f8] dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">Moods Recorded</span>
                    <span className="text-xl font-black text-neutral-900 dark:text-white block mt-0.5">
                      {foodConnection.total_moods_analyzed}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#faf9f8] dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">Meals Recorded</span>
                    <span className="text-xl font-black text-neutral-900 dark:text-white block mt-0.5">
                      {foodConnection.total_meals_analyzed}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#faf9f8] dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">Directly Linked Entries</span>
                    <span className="text-xl font-black text-teal-700 dark:text-teal-400 block mt-0.5">
                      {foodConnection.linked_meals_count}
                    </span>
                  </div>
                </div>

                {/* Grounded Insights List */}
                <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-2.5">
                  <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Reported Record Observations</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                    {foodConnection.insights.map((ins, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">&bull;</span>
                        <span>{ins}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prominent Scientific Disclaimer */}
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Scientific & Ethical Boundary Notice:</span>
                    <span>
                      Observed patterns highlight correlations within your self-reported logs. Correlation does not imply causation. NutriLens AI does not diagnose emotional eating disorders, nor make claims that specific foods cause emotional states.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ━━━ TAB 5: AI Mood Insights ━━━ */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 p-6 sm:p-7 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Gemini Health Reflection</span>
                </div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                  AI Emotional Wellness Insights
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  Non-judgmental, supportive reflections summarizing your self-reported emotional trends.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={aiDays}
                  onChange={(e) => setAiDays(parseInt(e.target.value, 10))}
                  className="px-3 py-2 text-xs rounded-xl bg-[#faf9f8] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold"
                >
                  <option value={7}>Last 7 Days</option>
                  <option value={14}>Last 14 Days</option>
                  <option value={30}>Last 30 Days</option>
                </select>

                <button
                  type="button"
                  onClick={handleGenerateAIInsights}
                  disabled={loadingAI}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {loadingAI ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Generate Reflection</span>
                </button>
              </div>
            </div>

            {loadingAI ? (
              <div className="p-12 text-center text-xs font-bold text-neutral-400 space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-600 mx-auto" />
                <p>Synthesizing supportive wellness reflection from your mood logs...</p>
              </div>
            ) : aiInsights ? (
              <div className="space-y-5 animate-in fade-in">
                {/* Summary Card */}
                <div className="p-5 rounded-2xl bg-[#faf9f8] dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">Overview Reflection</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {aiInsights.source === 'gemini' ? 'Gemini AI' : 'Wellness Engine'} &bull; {aiInsights.data_points_analyzed} check-ins
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white leading-relaxed">
                    {aiInsights.summary}
                  </p>
                </div>

                {/* Patterns Observed */}
                {aiInsights.patterns && aiInsights.patterns.length > 0 && (
                  <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700 space-y-2.5">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Identified Check-in Patterns</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                      {aiInsights.patterns.map((p, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">&bull;</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Supportive Wellness Suggestions */}
                {aiInsights.wellness_suggestions && aiInsights.wellness_suggestions.length > 0 && (
                  <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800 space-y-2.5">
                    <h4 className="text-xs font-bold text-teal-950 dark:text-teal-300 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-teal-600" />
                      <span>Supportive Lifestyle Suggestions</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                      {aiInsights.wellness_suggestions.map((sug, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prominent Medical Guardrail Notice */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-[11px] text-neutral-500 dark:text-neutral-400 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-700 dark:text-neutral-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>Non-Clinical Wellness Disclaimer</span>
                  </div>
                  <p>{aiInsights.disclaimer}</p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-neutral-500 space-y-2">
                <p>Click "Generate Reflection" to synthesize personalized wellness observations from your recent mood check-ins.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracking;
