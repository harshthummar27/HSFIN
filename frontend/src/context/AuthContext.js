import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Use localhost for development, production URL for production
const API_URL = process.env.REACT_APP_API_URL || 'https://hsfin-3-0.onrender.com/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const cleanedToken = cleanToken(token);
      if (cleanedToken) {
        verifyToken(cleanedToken);
      } else {
        localStorage.removeItem('token');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      // Token is already cleaned before calling this function
      if (!token) {
        localStorage.removeItem('token');
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data.success && response.data.token) {
        // Clean and store token
        const cleanedToken = cleanToken(response.data.token);
        if (cleanedToken) {
          localStorage.setItem('token', cleanedToken);
          setUser(response.data.user);
          return { success: true };
        } else {
          return {
            success: false,
            message: 'Invalid token received from server'
          };
        }
      }
      return {
        success: false,
        message: 'Login failed - no token received'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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

