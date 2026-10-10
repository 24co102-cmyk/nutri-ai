// src/context/AuthContext.tsx
import { createContext, useState, type ReactNode } from 'react';
import api from '../api/axios';

interface AuthContextProps {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const newToken = res.data.access_token;
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const register = async (name: string, email: string, password: string) => {
    console.log('Register payload', { name, email, password });
    const res = await api.post('/auth/register', { name, email, password });
    const newToken = res.data.access_token;
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!token;

  // Keep token in axios interceptor (handled in axios config)

  return (
    <AuthContext.Provider value={{ token, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
