import axios from 'axios';

// Use localhost for development, production URL for production
const API_URL = process.env.REACT_APP_API_URL || 'https://hsfin-1.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

// Helper function to clean token
const cleanToken = (token) => {
  if (!token) return null;
  // Remove all whitespace, quotes, and any invisible characters
  return token
    .trim()
    .replace(/^["']|["']$/g, '') // Remove quotes
    .replace(/\s/g, '') // Remove all whitespace
    .replace(/[\u200B-\u200D\uFEFF]/g, ''); // Remove zero-width spaces
};

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      const cleanedToken = cleanToken(token);
      if (cleanedToken) {
        config.headers.Authorization = `Bearer ${cleanedToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors - token expired or invalid
    if (error.response?.status === 401) {
      // Don't remove token for verify endpoint to avoid redirect loops
      const url = error.config?.url || '';
      if (!url.includes('/auth/verify')) {
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

