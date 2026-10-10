// src/api/axios.ts
import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return 'http://127.0.0.1:8001/api';
  return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

// No auth token interceptor needed in no-auth mode

export default api;
