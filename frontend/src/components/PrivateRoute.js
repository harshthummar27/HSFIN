import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
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

