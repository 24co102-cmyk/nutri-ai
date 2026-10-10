// src/pages/Meals.tsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import {
  History,
  PlusCircle,
  Trash2,
  Search,
  Flame,
  Utensils,
  TrendingUp,
  Award,
  Sparkles,
} from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';

interface Meal {
  id: number;
  created_at?: string;
  date?: string;
  meal_type?: string;
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
}

const Meals: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [timeFilter, setTimeFilter] = useState<'All' | 'Today' | 'Yesterday' | '7D' | '30D'>('All');
  const navigate = useNavigate();

  const fetchMeals = async () => {
    try {
      const res = await api.get('/meals/');
      setMeals(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this meal entry from history?')) return;
    try {
      await api.delete(`/meals/${id}`);
      setMeals((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete meal entry');
    }
  };

  // Filter meals based on search term, category, and time range
  const filteredMeals = meals.filter((m) => {
    const matchesSearch =
      (m.meal_type || 'Meal').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === 'All' || (m.meal_type || '').toLowerCase() === selectedType.toLowerCase();

    // Time filter
    let matchesTime = true;
    const mealDateStr = m.created_at || m.date;
    if (mealDateStr && timeFilter !== 'All') {
      const mealDate = new Date(mealDateStr);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - mealDate.getTime()) / (1000 * 3600 * 24));

      if (timeFilter === 'Today') {
        matchesTime = diffDays === 0 && mealDate.getDate() === now.getDate();
      } else if (timeFilter === 'Yesterday') {
        matchesTime = diffDays === 1 || (diffDays <= 1 && mealDate.getDate() === now.getDate() - 1);
      } else if (timeFilter === '7D') {
        matchesTime = diffDays <= 7;
      } else if (timeFilter === '30D') {
        matchesTime = diffDays <= 30;
      }
    }

    return matchesSearch && matchesType && matchesTime;
  });

  // Calculate Summary Metrics
  const totalCalories = filteredMeals.reduce((acc, m) => acc + (m.total_calories || 0), 0);
  const avgCalories = filteredMeals.length > 0 ? Math.round(totalCalories / filteredMeals.length) : 0;
  const totalProtein = filteredMeals.reduce((acc, m) => acc + (m.total_protein || 0), 0);
  const avgProtein = filteredMeals.length > 0 ? Math.round(totalProtein / filteredMeals.length) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-neutral-400">Loading your meal records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* ━━━ 1. Header Card ━━━ */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-200/80">
            <History className="w-3.5 h-3.5 text-emerald-600" />
            <span>Nutritional Timeline</span>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Meal History
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">
            Review your logged foods, caloric trends, and macro proportions across all previous meals.
          </p>
        </div>

        <button
          onClick={() => navigate('/add-meal')}
          className="premium-btn-primary text-xs flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Log New Meal
        </button>
      </div>

      {/* ━━━ 2. Top Summary Metric Cards ━━━ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Total Energy
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-neutral-900">
              {totalCalories.toLocaleString()}{' '}
              <span className="text-xs font-normal text-neutral-400">kcal</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500 font-medium">{filteredMeals.length} recorded entries</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Average Meal
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-neutral-900">
              {avgCalories}{' '}
              <span className="text-xs font-normal text-neutral-400">kcal/meal</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500 font-medium">Mean caloric intake</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Protein Average
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-neutral-900">
              {avgProtein}{' '}
              <span className="text-xs font-normal text-neutral-400">g/meal</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500 font-medium">High protein support</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Diet Consistency
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-neutral-900">
              94%{' '}
              <span className="text-xs font-normal text-neutral-400">Target</span>
            </div>
            <p className="mt-1 text-xs text-emerald-700 font-medium">Best adherence rating</p>
          </div>
        </div>
      </div>

      {/* ━━━ 3. Search and Date Filters ━━━ */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by meal category or food title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-medium"
            />
          </div>

          {/* Time Filter Chips */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200/80 overflow-x-auto w-full sm:w-auto">
            {(['All', 'Today', 'Yesterday', '7D', '30D'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  timeFilter === tf
                    ? 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tf === '7D' ? '7 Days' : tf === '30D' ? '30 Days' : tf}
              </button>
            ))}
          </div>
        </div>

        {/* Meal Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          {['All', 'Breakfast', 'Morning Snack', 'Lunch', 'Evening Snack', 'Dinner'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap border ${
                selectedType === type
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ━━━ 4. Meals Timeline List / Table ━━━ */}
      {filteredMeals.length === 0 ? (
        <EmptyState
          icon={Utensils}
          title="No Meals Found"
          description={
            searchTerm || selectedType !== 'All' || timeFilter !== 'All'
              ? 'No logged meals match your current filter parameters. Try clearing your search.'
              : 'You have not recorded any meals in your history log yet.'
          }
          actionText="+ Log a Meal Now"
          onAction={() => navigate('/add-meal')}
        />
      ) : (
        <div className="premium-card divide-y divide-neutral-100 overflow-hidden">
          {filteredMeals.map((meal) => {
            const dateStr = meal.created_at || meal.date;
            const formattedDate = dateStr
              ? new Date(dateStr).toLocaleString([], {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recent entry';

            return (
              <div
                key={meal.id}
                className="p-5 sm:p-6 hover:bg-[#faf9f8]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-200/80">
                    {meal.meal_type ? meal.meal_type[0].toUpperCase() : 'M'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-neutral-900">{meal.meal_type || 'Custom Meal'}</h3>
                      <span className="text-[11px] text-neutral-400 font-medium bg-neutral-100 px-2 py-0.5 rounded-md">
                        {formattedDate}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 font-medium">Logged to daily nutrition registry</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-base font-black text-neutral-900">{meal.total_calories || 0}</span>
                      <span className="text-xs text-neutral-400 ml-1">kcal</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200/60">
                        P: {meal.total_protein || 0}g
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60">
                        C: {meal.total_carbs || 0}g
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold border border-amber-200/60">
                        F: {meal.total_fat || 0}g
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(meal.id)}
                    title="Delete log entry"
                    className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Meals;
