// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { PageLoadingFallback } from './components/ui/SkeletonLoader';
import BackendStatusIndicator from './components/BackendStatusIndicator';

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

const App: React.FC = () => {
  React.useEffect(() => {
    // Ensure demo session is always active on both desktop & mobile
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', 'demo_access_token_nutrilens');
    }
    if (!localStorage.getItem('username')) {
      localStorage.setItem('username', 'AHAD SHAIKH');
    }
    // Clear any obsolete locks or flags
    localStorage.removeItem('unlocked_prototype');
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
            <Route path="/products" element={<Navigate to="/scan/barcode?tab=registry" replace />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </>
  );
};

export default App;
