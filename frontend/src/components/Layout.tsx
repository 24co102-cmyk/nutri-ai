// src/components/Layout.tsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isDashboard ? 'bg-[#030712] text-slate-100' : 'bg-[#faf9f8] text-neutral-900'
    }`}>
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Header setMobileOpen={setMobileOpen} />
        <main className={`flex-1 w-full mx-auto ${
          isDashboard ? 'p-2 sm:p-4 lg:p-6 max-w-7xl' : 'p-4 sm:p-6 lg:p-8 max-w-7xl'
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
