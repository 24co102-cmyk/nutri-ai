import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  PlusCircle,
  History,
  Camera,
  Barcode,
  Settings,
  User,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const navCategories = [
  {
    name: 'OVERVIEW',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    name: 'NUTRITION',
    items: [
      { path: '/diet-plan', label: 'Diet Plan', icon: UtensilsCrossed },
      { path: '/add-meal', label: 'Add Meal', icon: PlusCircle },
      { path: '/meals', label: 'Meal History', icon: History },
    ],
  },
  {
    name: 'SMART TOOLS',
    items: [
      { path: '/scan/photo', label: 'Photo Scanner', icon: Camera },
      { path: '/scan/barcode', label: 'Barcode Scanner', icon: Barcode, badge: '50-SLOT' },
      { path: '/chat', label: 'AI Assistant', icon: MessageSquare, badge: 'PRO' },
    ],
  },
  {
    name: 'SYSTEM',
    items: [
      { path: '/onboarding', label: 'My Profile', icon: User },
      { path: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  setMobileOpen,
  collapsed,
  setCollapsed,
}) => {
  // Prevent body scrolling when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileOpen, setMobileOpen]);
  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 bg-white border-r border-neutral-200/90 z-50 flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } ${mobileOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Logo Header */}
        <div className="h-18 flex items-center justify-between px-4 border-b border-neutral-100">
          <NavLink to="/dashboard" className="flex items-center gap-3 group min-w-0">
            {!collapsed && (
              <div className="truncate">
                <span className="text-xl font-black tracking-tight text-emerald-700 group-hover:text-emerald-800 transition-colors block">
                  NutriAI
                </span>
                <span className="block text-[9px] font-bold tracking-wider uppercase text-emerald-600/80">
                  AI HEALTH SUITE
                </span>
              </div>
            )}
            {collapsed && (
              <span className="text-lg font-black tracking-tight text-emerald-700 mx-auto">
                N
              </span>
            )}
          </NavLink>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grouped Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          {navCategories.map((group) => (
            <div key={group.name} className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-[10px] font-bold tracking-wider uppercase text-neutral-400 mb-1.5">
                  {group.name}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80 shadow-2xs'
                          : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#faf9f8]'
                      } ${collapsed ? 'justify-center px-0' : ''}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && !collapsed && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-600 rounded-r-full" />
                        )}
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? 'text-emerald-600' : 'text-neutral-400 group-hover:text-neutral-600'
                          }`}
                        />
                        {!collapsed && (
                          <span className="flex-1 truncate">{item.label}</span>
                        )}
                        {!collapsed && item.badge && (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold bg-emerald-100/80 text-emerald-800 rounded-md shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Desktop Collapse / Expand Toggle Button */}
        <div className="hidden lg:flex items-center justify-between px-3 py-2 border-t border-neutral-100">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-[#faf9f8] transition-colors text-xs font-medium gap-2"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[11px] font-semibold text-neutral-500">Collapse menu</span>
              </>
            )}
          </button>
        </div>

        {/* Bottom Profile Summary Card */}
        <div className="p-3 border-t border-neutral-100 bg-[#faf9f8]/50 flex flex-col gap-2">
          <NavLink
            to="/onboarding"
            className={`flex items-center gap-3 p-2 rounded-xl bg-white border border-neutral-200/80 hover:border-neutral-300 transition-colors ${
              collapsed ? 'justify-center p-1.5' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-2xs">
              AS
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-bold text-neutral-900 truncate">{localStorage.getItem('username') || 'AHAD SHAIKH'}</p>
                <p className="text-[10px] font-medium text-neutral-400 truncate">Target: 2,000 kcal</p>
              </div>
            )}
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
