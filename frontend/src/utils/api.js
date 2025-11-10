import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://hsfin-3-0.onrender.com/api';

const api = axios.create({ baseURL: API_URL });

const cleanToken = (token) => {
  if (!token) return null;
  return token.trim().replace(/^["']|["']$/g, '').replace(/\s/g, '');
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    const cleanedToken = cleanToken(token);
    if (cleanedToken) {
      config.headers.Authorization = `Bearer ${cleanedToken}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      if (!url.includes('/auth/verify') && !url.includes('/auth/login') && !url.includes('/auth/register')) {
        localStorage.removeItem('token');
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

