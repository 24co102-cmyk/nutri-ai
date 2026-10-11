// src/pages/Onboarding.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { User, Activity, Heart, Save, CheckCircle2, Moon, Sun, Edit2, Check, X } from 'lucide-react';
import { useUser, useTheme } from '../utils/theme';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { userName, initials, updateName } = useUser();
  const { isDark, toggleTheme } = useTheme();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const [profile, setProfile] = useState<any>({
    age: '26',
    sex: 'male',
    height_cm: '178',
    weight_kg: '71',
    activity_level: 'moderate',
    health_goal: 'Weight Loss & Fitness',
    dietary_preferences: 'Balanced',
    allergies: 'None',
    foods_to_avoid: 'Processed Sugar',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/');
        if (res.data) {
          setProfile({
            age: res.data.age ?? '26',
            sex: res.data.sex ?? 'male',
            height_cm: res.data.height_cm ?? '178',
            weight_kg: res.data.weight_kg ?? '71',
            activity_level: res.data.activity_level ?? 'moderate',
            health_goal: res.data.goal ?? res.data.health_goal ?? 'Weight Loss & Fitness',
            dietary_preferences: res.data.diet_type ?? res.data.dietary_preferences ?? 'Balanced',
            allergies: res.data.allergies ?? 'None',
            foods_to_avoid: res.data.foods_to_avoid ?? 'Processed Sugar',
          });
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (tempName.trim()) {
      updateName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put('/profile/', profile);
      setMessage('Profile updated successfully!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error(err);
      alert('Failed to save profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate BMI preview
  const h = (Number(profile.height_cm) || 178) / 100;
  const bmiVal = Number(((Number(profile.weight_kg) || 71) / (h * h)).toFixed(1));

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Profile Avatar Card */}
      <div className="premium-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-neutral-900 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-neutral-900/20 shrink-0">
            {initials}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="px-2.5 py-1 text-base font-bold rounded-lg border border-emerald-500 bg-white text-neutral-900 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                    title="Save"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTempName(userName);
                      setIsEditingName(false);
                    }}
                    className="p-1 rounded-lg border border-neutral-300 text-neutral-500 hover:bg-neutral-100"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <>
                  <h2 className="text-2xl font-extrabold text-neutral-900">{userName}</h2>
                  <button
                    onClick={() => {
                      setTempName(userName);
                      setIsEditingName(true);
                    }}
                    className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
                    title="Edit Name"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </>
              )}
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                Pro Member
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1 font-medium">
              Goal: <span className="font-bold text-neutral-800">{profile.health_goal}</span> | BMI: <span className="font-bold text-emerald-600">{bmiVal}</span>
            </p>
          </div>
        </div>

        {/* Real Working Dark Mode Toggle on Profile Card */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            type="button"
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-xs ${
              isDark
                ? 'bg-indigo-950/80 text-indigo-200 border-indigo-700 hover:bg-indigo-900'
                : 'bg-neutral-100 text-neutral-800 border-neutral-200 hover:bg-neutral-200'
            }`}
            title="Toggle Dark Mode Theme"
          >
            {isDark ? (
              <>
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark Mode: ON</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Dark Mode: OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-6">
        {/* Section 1: Physical Attributes */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
            <User className="w-5 h-5 text-emerald-600" />
            1. Physical Attributes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Age (Years)</label>
              <input
                name="age"
                type="number"
                value={profile.age}
                onChange={handleChange}
                className="w-full p-2.5 text-sm rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Gender</label>
              <select
                name="sex"
                value={profile.sex}
                onChange={handleChange}
                className="w-full p-2.5 text-sm rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-medium"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Height (cm)</label>
              <input
                name="height_cm"
                type="number"
                value={profile.height_cm}
                onChange={handleChange}
                className="w-full p-2.5 text-sm rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Weight (kg)</label>
              <input
                name="weight_kg"
                type="number"
                value={profile.weight_kg}
                onChange={handleChange}
                className="w-full p-2.5 text-sm rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-medium"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Activity & Goals */}
        <div className="space-y-4 pt-2">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Activity className="w-5 h-5 text-teal-600" />
            2. Activity Level & Health Goal
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Activity Level</label>
              <select
                name="activity_level"
                value={profile.activity_level}
                onChange={handleChange}
                className="w-full p-2.5 text-sm rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-medium"
                required
              >
                <option value="sedentary">Sedentary (Little or no exercise)</option>
                <option value="light">Lightly Active (1-3 days/week)</option>
                <option value="moderate">Moderately Active (3-5 days/week)</option>
                <option value="active">Active (6-7 days/week)</option>
                <option value="very_active">Very Active (Physical job/training)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Health & Fitness Goal</label>
              <input
                name="health_goal"
                type="text"
                value={profile.health_goal}
                onChange={handleChange}
                className="w-full p-2.5 text-sm rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Preferences */}
        <div className="space-y-4 pt-2">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Heart className="w-5 h-5 text-rose-500" />
            3. Dietary Preferences & Allergies
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Diet Type</label>
              <input
                name="dietary_preferences"
                type="text"
                value={profile.dietary_preferences}
                onChange={handleChange}
                className="w-full p-2.5 text-sm rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Allergies</label>
              <input
                name="allergies"
                type="text"
                value={profile.allergies}
                onChange={handleChange}
                className="w-full p-2.5 text-sm rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Foods to Avoid</label>
              <input
                name="foods_to_avoid"
                type="text"
                value={profile.foods_to_avoid}
                onChange={handleChange}
                className="w-full p-2.5 text-sm rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex items-center justify-between">
          {message ? (
            <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {message}
            </div>
          ) : <span />}

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {submitting ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Onboarding;
