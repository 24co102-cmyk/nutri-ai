// src/utils/theme.ts
import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';

export const getStoredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = (theme: ThemeMode) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme', theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  window.dispatchEvent(new CustomEvent('nutrilens:theme-changed', { detail: { theme } }));
};

export const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';
    return document.documentElement.classList.contains('dark') ? 'dark' : getStoredTheme();
  });

  useEffect(() => {
    const handleThemeChange = (e: any) => {
      const newTheme = e.detail?.theme;
      if (newTheme === 'dark' || newTheme === 'light') {
        setThemeState(newTheme);
      }
    };
    window.addEventListener('nutrilens:theme-changed', handleThemeChange);
    return () => window.removeEventListener('nutrilens:theme-changed', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setThemeState(next);
  };

  const setDark = (isDark: boolean) => {
    const next = isDark ? 'dark' : 'light';
    applyTheme(next);
    setThemeState(next);
  };

  return { isDark: theme === 'dark', theme, toggleTheme, setDark };
};

// User Display Name Utilities
export const getUserName = (): string => {
  if (typeof window === 'undefined') return 'AHAD SHAIKH';
  return localStorage.getItem('username') || 'AHAD SHAIKH';
};

export const setUserName = (name: string) => {
  if (typeof window !== 'undefined') {
    const trimmed = name.trim() || 'AHAD SHAIKH';
    localStorage.setItem('username', trimmed);
    window.dispatchEvent(new CustomEvent('nutrilens:user-updated', { detail: { username: trimmed } }));
  }
};

export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (name.substring(0, 2) || 'AS').toUpperCase();
};

export const useUser = () => {
  const [userName, setUserNameState] = useState<string>(getUserName);

  useEffect(() => {
    const handleUserUpdate = (e: any) => {
      if (e.detail?.username) {
        setUserNameState(e.detail.username);
      }
    };
    window.addEventListener('nutrilens:user-updated', handleUserUpdate);
    return () => window.removeEventListener('nutrilens:user-updated', handleUserUpdate);
  }, []);

  const updateName = (name: string) => {
    setUserName(name);
    setUserNameState(name);
  };

  return { userName, initials: getInitials(userName), updateName };
};
