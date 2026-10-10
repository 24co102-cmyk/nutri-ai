// src/pages/Settings.tsx
import React, { useState } from 'react';
import { User, Bell, Moon, Globe, Shield, Flame, Sliders, Check, Lock, Eye, LogOut } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'account' | 'preferences' | 'nutrition' | 'security'>('account');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English (US)');
  const [targetCalories, setTargetCalories] = useState(2000);
  const [dietPref, setDietPref] = useState('Balanced');
  const [allergiesInput, setAllergiesInput] = useState('None');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFullLogout = () => {
    if (window.confirm('Are you sure you want to log out of NutriLens and open Gmail?')) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = 'https://mail.google.com';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Settings Header */}
      <div className="premium-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600" />
            Settings Center
          </h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Customize system account parameters, alerts, nutrition goals, and privacy options.
          </p>
        </div>

        {saved && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1.5 border border-emerald-200">
            <Check className="w-4 h-4 text-emerald-600" />
            Changes Saved!
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-200/80 gap-2 overflow-x-auto pb-1">
        {[
          { id: 'account', label: 'ACCOUNT', icon: User },
          { id: 'preferences', label: 'PREFERENCES', icon: Globe },
          { id: 'nutrition', label: 'NUTRITION', icon: Flame },
          { id: 'security', label: 'SECURITY', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                active
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Cards */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-6">
        {activeTab === 'account' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-neutral-900">Account & Profile Information</h3>

            <div className="divide-y divide-neutral-100">
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">User Display Name</h4>
                    <p className="text-xs text-neutral-500 font-medium">AHAD SHAIKH</p>
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  className="px-3.5 py-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-[#faf9f8] text-xs font-bold"
                >
                  Edit Name
                </button>
              </div>

              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Email Address</h4>
                    <p className="text-xs text-neutral-500 font-medium">ahad.shaikh@example.com</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Verified
                </span>
              </div>

              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Subscription Tier</h4>
                    <p className="text-xs text-neutral-500 font-medium">Pro Health AI Suite</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  Pro Active
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-neutral-900">App Preferences</h3>

            <div className="divide-y divide-neutral-100">
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Meal Logging Reminders</h4>
                    <p className="text-xs text-neutral-500 font-medium">Push alerts for breakfast, lunch & dinner logging.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => { setNotifications(e.target.checked); handleSave(); }}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Dark Mode Palette</h4>
                    <p className="text-xs text-neutral-500 font-medium">Toggle night mode visual interface.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => { setDarkMode(e.target.checked); handleSave(); }}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Primary Language</h4>
                    <p className="text-xs text-neutral-500 font-medium">Select regional language preference.</p>
                  </div>
                </div>
                <select
                  value={language}
                  onChange={(e) => { setLanguage(e.target.value); handleSave(); }}
                  className="p-2 text-xs font-bold rounded-xl bg-[#faf9f8] border border-neutral-200 focus:outline-none"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-neutral-900">Nutrition & Calorie Goals</h3>

            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-neutral-700">Daily Calorie Limit Target</label>
                  <span className="text-sm font-extrabold text-emerald-600">{targetCalories} kcal / day</span>
                </div>
                <input
                  type="range"
                  min="1200"
                  max="4000"
                  step="50"
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Dietary Preference</label>
                  <input
                    type="text"
                    value={dietPref}
                    onChange={(e) => setDietPref(e.target.value)}
                    className="w-full p-2.5 text-xs font-bold rounded-xl bg-[#faf9f8] border border-neutral-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Allergies List</label>
                  <input
                    type="text"
                    value={allergiesInput}
                    onChange={(e) => setAllergiesInput(e.target.value)}
                    className="w-full p-2.5 text-xs font-bold rounded-xl bg-[#faf9f8] border border-neutral-200"
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
              >
                Save Nutrition Goals
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-neutral-900">Security & Privacy Controls</h3>

            <div className="divide-y divide-neutral-100">
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Account Password</h4>
                    <p className="text-xs text-neutral-500 font-medium">Last updated 30 days ago.</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Password update request sent!')}
                  className="px-3.5 py-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-[#faf9f8] text-xs font-bold"
                >
                  Change Password
                </button>
              </div>

              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Health Data Privacy</h4>
                    <p className="text-xs text-neutral-500 font-medium">Your nutrition database entries are encrypted locally.</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Encrypted
                </span>
              </div>

              {/* Full Logout Section */}
              <div className="pt-4 mt-2">
                <div className="p-5 rounded-2xl bg-rose-50/80 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20 shrink-0">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-rose-950">Log Out & Redirect to Gmail</h4>
                      <p className="text-xs text-rose-700 font-medium mt-0.5">
                        Clears all local auth state and opens Gmail (mail.google.com).
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleFullLogout}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout to Gmail</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
