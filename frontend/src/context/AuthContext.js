import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

// Helper function to clean token
const cleanToken = (token) => {
  if (!token) return null;
  return token.trim().replace(/^["']|["']$/g, '').replace(/\s/g, '');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await api.get('/auth/verify');
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success && response.data.token) {
        const cleanedToken = cleanToken(response.data.token);
        if (cleanedToken) {
          localStorage.setItem('token', cleanedToken);
          setUser(response.data.user);
          setLoading(false);
          return { success: true };
        }
        return { success: false, message: 'Invalid token received' };
      }
      return { success: false, message: 'Login failed - no token received' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      if (response.data.success && response.data.token) {
        const cleanedToken = cleanToken(response.data.token);
        if (cleanedToken) {
          localStorage.setItem('token', cleanedToken);
          setUser(response.data.user);
          setLoading(false);
          return { success: true };
        }
        return { success: false, message: 'Invalid token received' };
      }
      return { success: false, message: 'Registration failed - no token received' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

