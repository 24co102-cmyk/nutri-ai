// src/api/axios.ts
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return 'https://nutri-ai-y70w.onrender.com/api';
  return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000, // 30s timeout to allow Render wakeups without hanging indefinitely
  headers: {
    'Accept': 'application/json',
  },
});

// Attach auth token if available in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// In-flight GET request deduplication map
const pendingGetRequests = new Map<string, Promise<any>>();

// Render cold-start detection timer
let activeRequestsCount = 0;
let coldStartTimer: any = null;

const notifyColdStart = (waking: boolean) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nutrilens:backend-status', { detail: { waking } }));
  }
};

const onRequestStart = () => {
  activeRequestsCount++;
  if (activeRequestsCount === 1) {
    coldStartTimer = setTimeout(() => {
      // If requests are still pending after 3.5 seconds, Render instance is likely waking up
      if (activeRequestsCount > 0) {
        notifyColdStart(true);
      }
    }, 3500);
  }
};

const onRequestEnd = () => {
  activeRequestsCount = Math.max(0, activeRequestsCount - 1);
  if (activeRequestsCount === 0) {
    clearTimeout(coldStartTimer);
    notifyColdStart(false);
  }
};

// Request interceptor to start cold-start timer
api.interceptors.request.use((config) => {
  onRequestStart();
  return config;
}, (error) => {
  onRequestEnd();
  return Promise.reject(error);
});

// Response interceptor to end cold-start timer
api.interceptors.response.use((response) => {
  onRequestEnd();
  return response;
}, (error) => {
  onRequestEnd();
  return Promise.reject(error);
});

// Deduplicated GET helper
const originalGet = api.get.bind(api);
api.get = ((url: string, config?: AxiosRequestConfig): Promise<any> => {
  // Only deduplicate plain GET requests without custom cancellation signal
  if (!config?.signal) {
    const key = `GET:${url}:${JSON.stringify(config?.params || {})}`;
    const existing = pendingGetRequests.get(key);
    if (existing) {
      return existing;
    }

    const promise = originalGet(url, config).finally(() => {
      pendingGetRequests.delete(key);
    });
    pendingGetRequests.set(key, promise);
    return promise;
  }
  return originalGet(url, config);
}) as any;

export default api;


