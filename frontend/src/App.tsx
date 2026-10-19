// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { PageLoadingFallback } from './components/ui/SkeletonLoader';
import BackendStatusIndicator from './components/BackendStatusIndicator';

import api from './api/axios';

// Code-split heavy page bundles for instant initial load
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DietPlan = lazy(() => import('./pages/DietPlan'));
const AddMeal = lazy(() => import('./pages/AddMeal'));
const Meals = lazy(() => import('./pages/Meals'));
const PhotoScan = lazy(() => import('./pages/PhotoScan'));
const BarcodeScan = lazy(() => import('./pages/BarcodeScan'));
const Chat = lazy(() => import('./pages/Chat'));
const Settings = lazy(() => import('./pages/Settings'));
const MoodTracking = lazy(() => import('./pages/MoodTracking'));

const App: React.FC = () => {
  React.useEffect(() => {
    // Ensure active JWT session is initialized
    const existingToken = localStorage.getItem('token');
    if (!existingToken || existingToken === 'demo_access_token_nutrilens') {
      api.post('/auth/login', {
        email: 'demo@nutrilens.app',
        password: 'password123'
      }).then((res) => {
        if (res.data?.access_token) {
          localStorage.setItem('token', res.data.access_token);
          if (!localStorage.getItem('username')) {
            localStorage.setItem('username', 'Demo User');
          }
        }
      }).catch((e) => {
        console.warn('Authentication warmup:', e);
      });
    }
    if (!localStorage.getItem('username')) {
      localStorage.setItem('username', 'Demo User');
    }
    // Initialize Dark Mode according to stored preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia?.('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Clear any obsolete locks or flags
    localStorage.removeItem('unlocked_prototype');

    // Silent background warmup for Render cloud backend instance
    const healthUrl = import.meta.env.VITE_API_URL 
      ? (import.meta.env.VITE_API_URL.endsWith('/api') ? `${import.meta.env.VITE_API_URL}/health` : `${import.meta.env.VITE_API_URL}/api/health`)
      : 'https://nutri-ai-y70w.onrender.com/api/health';
    fetch(healthUrl, { mode: 'cors' }).catch(() => {});
  }, []);

  return (
    <>
      <BackendStatusIndicator />
      <Layout>
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/profile" element={<Onboarding />} />
            <Route path="/diet-plan" element={<DietPlan />} />
            <Route path="/add-meal" element={<AddMeal />} />
            <Route path="/meals" element={<Meals />} />
            <Route path="/scan/photo" element={<PhotoScan />} />
            <Route path="/scan/barcode" element={<BarcodeScan />} />
            <Route path="/scan/qr" element={<Navigate to="/scan/barcode" replace />} />
            <Route path="/products" element={<Navigate to="/scan/barcode" replace />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/mood-tracking" element={<MoodTracking />} />
            <Route path="/emotion-tracking" element={<Navigate to="/mood-tracking" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </>
  );
};

export default App;
