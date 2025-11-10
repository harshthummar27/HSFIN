import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import api from '../utils/api';

const PrivateRoute = ({ children }) => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Optimized token verification - skip if user already authenticated
  useEffect(() => {
    // If user is already set, skip verification
    if (user && (user.userId || user.id)) {
      setIsAuthorized(true);
      setIsVerifying(false);
      return;
    }

    // Wait for auth context to finish loading
    if (loading) {
      return;
    }

    const verifyTokenOnRoute = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthorized(false);
        setIsVerifying(false);
        return;
      }

      try {
        const response = await api.get('/auth/verify');
        if (response.data.success && response.data.user) {
          if (response.data.user.userId || response.data.user.id) {
            setIsAuthorized(true);
          } else {
            localStorage.removeItem('token');
            setIsAuthorized(false);
          }
        } else {
          localStorage.removeItem('token');
          setIsAuthorized(false);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setIsAuthorized(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyTokenOnRoute();
  }, [location.pathname, loading, user]);

  // Show loading state while checking authentication
  if (loading || isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: '#49111c' }}></div>
          <div className="text-lg font-semibold" style={{ color: '#0A0908' }}>Verifying authentication...</div>
          <div className="text-sm text-gray-600 mt-2">Please wait</div>
        </div>
      </div>
    );
  }

  // Redirect to home if not authorized
  if (!user || !isAuthorized) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Ensure user has userId (required for user-scoped data access)
  if (!user.userId && !user.id) {
    logout();
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <Sidebar />
      <div className="flex-1 w-full md:ml-64">
        <TopNavbar />
        <div className="pt-16 md:pt-16">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PrivateRoute;

