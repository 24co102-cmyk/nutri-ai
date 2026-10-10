// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import DietPlan from './pages/DietPlan';
import AddMeal from './pages/AddMeal';
import Meals from './pages/Meals';
import PhotoScan from './pages/PhotoScan';
import BarcodeScan from './pages/BarcodeScan';
import Chat from './pages/Chat';
import Settings from './pages/Settings';

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
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default App;
