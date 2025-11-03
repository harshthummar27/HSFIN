import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

