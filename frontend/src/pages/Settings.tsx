import React, { useState } from 'react';
import { User, Bell, Moon, Globe, Shield, Flame, Sliders, Check, Lock, Eye, LogOut, Edit2, X, CheckCircle } from 'lucide-react';
import { useTranslation, type SupportedLanguage, LANGUAGES } from '../utils/i18n';
import { useTheme, useUser } from '../utils/theme';

const Settings: React.FC = () => {
  const { t, currentLang, changeLanguage } = useTranslation();
  const { isDark, setDark } = useTheme();
  const { userName, updateName } = useUser();

  const [activeTab, setActiveTab] = useState<'account' | 'preferences' | 'nutrition' | 'security'>('account');
  const [notifications, setNotifications] = useState(true);

  // User display name inline edit state
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  // Nutrition goals
  const [targetCalories, setTargetCalories] = useState(2000);
  const [dietPref, setDietPref] = useState('Balanced');
  const [allergiesInput, setAllergiesInput] = useState('None');
  const [saved, setSaved] = useState(false);

  const handleSaveNotification = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (tempName.trim()) {
      updateName(tempName.trim());
      setIsEditingName(false);
      handleSaveNotification();
    }
  };

  const handleCancelName = () => {
    setTempName(userName);
    setIsEditingName(false);
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
            {t('settings_title')}
          </h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            {t('settings_desc')}
          </p>
        </div>

        {saved && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1.5 border border-emerald-200">
            <Check className="w-4 h-4 text-emerald-600" />
            {t('changes_saved')}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-200/80 gap-2 overflow-x-auto pb-1">
        {[
          { id: 'account', label: t('tab_account'), icon: User },
          { id: 'preferences', label: t('tab_preferences'), icon: Globe },
          { id: 'nutrition', label: t('tab_nutrition'), icon: Flame },
          { id: 'security', label: t('tab_security'), icon: Shield },
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
            <h3 className="text-base font-bold text-neutral-900">{t('account_header')}</h3>

            <div className="divide-y divide-neutral-100">
              {/* User Display Name with functional Edit */}
              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{t('user_display_name')}</h4>
                    {!isEditingName && (
                      <p className="text-xs text-neutral-500 font-bold mt-0.5 tracking-wide text-emerald-700">
                        {userName}
                      </p>
                    )}
                  </div>
                </div>

                {isEditingName ? (
                  <form onSubmit={handleSaveName} className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Enter display name"
                      className="px-3 py-1.5 text-xs font-bold rounded-xl border border-emerald-400 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-neutral-900 flex-1 sm:w-48"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {t('save_name')}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelName}
                      className="px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      {t('cancel')}
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => {
                      setTempName(userName);
                      setIsEditingName(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-[#faf9f8] text-xs font-bold flex items-center gap-1.5 w-fit"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-neutral-500" />
                    {t('edit_name')}
                  </button>
                )}
              </div>

              {/* Email Address */}
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{t('email_address')}</h4>
                    <p className="text-xs text-neutral-500 font-medium">ahad.shaikh@example.com</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {t('verified')}
                </span>
              </div>

              {/* Subscription Tier */}
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{t('subscription_tier')}</h4>
                    <p className="text-xs text-neutral-500 font-medium">Pro Health AI Suite</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  {t('pro_active')}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-neutral-900">{t('preferences_header')}</h3>

            <div className="divide-y divide-neutral-100">
              {/* Meal Logging Reminders */}
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{t('meal_reminders')}</h4>
                    <p className="text-xs text-neutral-500 font-medium">{t('meal_reminders_desc')}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => {
                    setNotifications(e.target.checked);
                    handleSaveNotification();
                  }}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* Functional Dark Mode Toggle */}
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{t('dark_mode')}</h4>
                    <p className="text-xs text-neutral-500 font-medium">{t('dark_mode_desc')}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isDark}
                  onChange={(e) => {
                    setDark(e.target.checked);
                    handleSaveNotification();
                  }}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* Functional Primary Language (5 languages) */}
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{t('primary_language')}</h4>
                    <p className="text-xs text-neutral-500 font-medium">{t('primary_language_desc')}</p>
                  </div>
                </div>
                <select
                  value={currentLang}
                  onChange={(e) => {
                    changeLanguage(e.target.value as SupportedLanguage);
                    handleSaveNotification();
                  }}
                  className="p-2 text-xs font-bold rounded-xl bg-[#faf9f8] border border-neutral-200 focus:outline-none cursor-pointer"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-neutral-900">{t('nutrition_header')}</h3>

            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-neutral-700">{t('calorie_target')}</label>
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
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">{t('diet_pref')}</label>
                  <input
                    type="text"
                    value={dietPref}
                    onChange={(e) => setDietPref(e.target.value)}
                    className="w-full p-2.5 text-xs font-bold rounded-xl bg-[#faf9f8] border border-neutral-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">{t('allergies_list')}</label>
                  <input
                    type="text"
                    value={allergiesInput}
                    onChange={(e) => setAllergiesInput(e.target.value)}
                    className="w-full p-2.5 text-xs font-bold rounded-xl bg-[#faf9f8] border border-neutral-200"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveNotification}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
              >
                {t('save_nutrition')}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-neutral-900">{t('security_header')}</h3>

            <div className="divide-y divide-neutral-100">
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{t('account_password')}</h4>
                    <p className="text-xs text-neutral-500 font-medium">{t('password_updated')}</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Password update request sent!')}
                  className="px-3.5 py-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-[#faf9f8] text-xs font-bold"
                >
                  {t('change_password')}
                </button>
              </div>

              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{t('data_privacy')}</h4>
                    <p className="text-xs text-neutral-500 font-medium">{t('privacy_desc')}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {t('encrypted')}
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
                      <h4 className="text-sm font-extrabold text-rose-950">{t('logout_gmail_title')}</h4>
                      <p className="text-xs text-rose-700 font-medium mt-0.5">
                        {t('logout_gmail_desc')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleFullLogout}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('logout_gmail_btn')}</span>
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
