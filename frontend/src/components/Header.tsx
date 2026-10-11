// src/components/Header.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react';

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
}

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Health Dashboard', subtitle: 'Daily nutrition overview & health analytics' },
  '/onboarding': { title: 'My Profile', subtitle: 'Manage biometrics, dietary goals & calorie targets' },
  '/profile': { title: 'My Profile', subtitle: 'Manage biometrics, dietary goals & calorie targets' },
  '/diet-plan': { title: 'Diet Plan', subtitle: 'Personalized meal schedule & AI generator' },
  '/add-meal': { title: 'Log Meal', subtitle: 'Search database, scan barcodes, or log custom food' },
  '/meals': { title: 'Meal History', subtitle: 'Review daily nutrition logs and macronutrient trends' },
  '/scan/photo': { title: 'Photo Food Scanner', subtitle: 'Computer vision food identification & macro estimation' },
  '/scan/barcode': { title: 'Barcode Scanner & Registry', subtitle: '12-digit barcode inventory, scanning & product lookup' },
  '/nutrilens': { title: 'NutriLens Intelligence', subtitle: 'Food quality analysis, allergen screening & health scoring' },
  '/chat': { title: 'AI Health Assistant', subtitle: 'Interactive clinical-grade nutrition Q&A and dietary coach' },
  '/settings': { title: 'Settings Center', subtitle: 'App preferences, alerts, nutrition parameters & privacy' },
};

export const Header: React.FC<HeaderProps> = ({ setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const meta = routeTitles[location.pathname] || {
    title: 'NutriLens',
    subtitle: 'AI Health & Nutrition Suite',
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/add-meal?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className={`sticky top-0 z-30 px-4 sm:px-8 h-18 flex items-center justify-between gap-4 transition-colors ${
      isDashboard
        ? 'bg-[#030712]/90 backdrop-blur-md border-b border-emerald-500/20 text-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.6)]'
        : 'bg-white/90 backdrop-blur-md border-b border-neutral-200/80 text-neutral-900'
    }`}>
      {/* Mobile Menu & Page Heading */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setMobileOpen(true)}
          className={`lg:hidden p-2 rounded-xl transition-colors ${
            isDashboard
              ? 'text-emerald-400 hover:text-emerald-200 hover:bg-emerald-950/40 border border-emerald-500/30'
              : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'
          }`}
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className={`text-lg font-bold tracking-tight leading-none truncate ${
            isDashboard ? 'text-emerald-400 font-mono flex items-center gap-2' : 'text-neutral-900'
          }`}>
            {isDashboard ? (
              <>
                <span className="text-emerald-500 animate-pulse">&gt;</span>
                <span>SYSTEM_HUD // OVERVIEW</span>
              </>
            ) : (
              meta.title
            )}
          </h1>
          <p className={`text-xs mt-1 font-medium hidden sm:block truncate ${
            isDashboard ? 'text-emerald-600/80 font-mono tracking-wider text-[11px]' : 'text-neutral-500'
          }`}>
            {isDashboard ? 'ONLINE // NEURAL BIO-CORE v4.2 // TELEMETRY LINKED' : meta.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Global Search */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-64">
          <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
            isDashboard ? 'text-emerald-500/60' : 'text-neutral-400'
          }`} />
          <input
            type="text"
            placeholder={isDashboard ? "EXEC_SEARCH /food..." : "Search foods, meals, nutrition..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-12 py-2 text-xs rounded-xl focus:outline-none transition-all ${
              isDashboard
                ? 'bg-black/60 border border-emerald-500/30 text-emerald-300 placeholder:text-emerald-700/60 font-mono focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30'
                : 'bg-[#faf9f8] border border-neutral-200/80 text-neutral-900 focus:border-emerald-500 focus:bg-white font-medium'
            }`}
          />
          <kbd className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
            isDashboard
              ? 'text-emerald-400/80 bg-emerald-950/40 border-emerald-500/30'
              : 'text-neutral-400 bg-white border-neutral-200 shadow-2xs'
          }`}>
            ↵
          </kbd>
        </form>

        {/* AI Health Engine Status Indicator */}
        <div className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold ${
          isDashboard
            ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 font-mono tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.15)]'
            : 'bg-emerald-50/90 border border-emerald-200/80 text-emerald-800'
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span>{isDashboard ? 'NEURAL ENGINE: ACTIVE' : 'AI Engine Active'}</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-xl transition-colors border ${
              isDashboard
                ? 'text-emerald-400 hover:text-emerald-200 bg-black/40 border-emerald-500/30 hover:border-emerald-400'
                : 'text-neutral-500 hover:text-neutral-800 hover:bg-[#faf9f8] border-neutral-200/80'
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-black" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-neutral-200 p-4 space-y-3 z-50 text-xs animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="font-bold text-neutral-900">Notifications</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-950">Calorie Target on Track</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      You are within 420 kcal of your daily target for today.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200/80 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-neutral-900">AI Nutrition Recommendation</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Consider a high-protein dinner to meet your 130g target.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <button
          onClick={() => navigate('/onboarding')}
          className="flex items-center gap-2 pl-2 border-l border-neutral-200 hover:opacity-90 transition-opacity"
          title="Account Settings"
        >
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
            AM
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
