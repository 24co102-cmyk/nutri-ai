// src/App.tsx
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { PageLoadingFallback } from './components/ui/SkeletonLoader';
import BackendStatusIndicator from './components/BackendStatusIndicator';

// Code-split heavy page bundles for instant initial load
const Login = lazy(() => import('./pages/Login'));
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token');
  });

  const handleLogin = (token: string, username: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setIsAuthenticated(false);
    };
    window.addEventListener('logout', handleLogout);
    return () => window.removeEventListener('logout', handleLogout);
  }, []);

  return (
    <>
      <BackendStatusIndicator />
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />} 
          />
          
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Layout>
                  <Suspense fallback={<PageLoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
