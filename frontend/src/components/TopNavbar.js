import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/HSFIN.png';

const TopNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get page title from route
  const getPageTitle = () => {
    const titles = {
      '/dashboard': 'Dashboard',
      '/daily-debit': 'Daily Debit',
      '/loan': 'Loan Management',
      '/credit-card': 'Credit Card Management',
      '/credit-person': 'Credit Person',
      '/debit-person': 'Debit Person',
      '/stock-market': 'Stock Market',
      '/balance': 'Balance',
      '/other-note': 'Other Note',
      '/rules': 'Rules'
    };
    return titles[location.pathname] || 'Dashboard';
  };

  return (
    <>
      <nav className="bg-white shadow-md fixed top-0 right-0 left-0 md:left-64 z-30">
        <div className="px-2 md:px-6 py-2 md:py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Mobile Menu Button - Animated Hamburger Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-8 h-8 md:w-10 md:h-10 flex flex-col justify-center items-center rounded-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              style={{ backgroundColor: '#003049' }}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span
                className={`absolute w-4 md:w-5 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
                }`}
                style={{ backgroundColor: '#ffffff' }}
              ></span>
              <span
                className={`absolute w-4 md:w-5 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
                style={{ backgroundColor: '#ffffff' }}
              ></span>
              <span
                className={`absolute w-4 md:w-5 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
                }`}
                style={{ backgroundColor: '#ffffff' }}
              ></span>
            </button>
            {/* Logo - Desktop Only */}
            <div className="hidden md:flex items-center space-x-3">
              <img 
                src={logo} 
                alt="HSFIN Logo" 
                className="h-8 md:h-9 w-auto object-contain"
                style={{ maxHeight: '36px' }}
              />
              <div className="h-6 w-px bg-gray-300"></div>
            </div>
            {/* Mobile Logo */}
            <div className="md:hidden flex items-center space-x-1.5 md:space-x-2">
              <img 
                src={logo} 
                alt="HSFIN Logo" 
                className="h-6 md:h-7 w-auto object-contain"
                style={{ maxHeight: '28px' }}
              />
              <div className="h-4 md:h-5 w-px bg-gray-300"></div>
            </div>
            <h2 className="text-sm md:text-lg font-semibold" style={{ color: '#003049' }}>{getPageTitle()}</h2>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={handleLogout}
              className="text-white px-2 md:px-4 py-1 md:py-2 rounded-lg transition-all hover:scale-105 shadow-md text-xs md:text-sm font-semibold"
              style={{ backgroundColor: '#dc2626' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            className={`fixed left-0 top-0 h-full w-64 bg-white shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-out ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            style={{ zIndex: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-2 md:px-4 py-3 md:py-5 border-b border-gray-200 bg-gradient-to-br from-white to-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center flex-1">
                  <img 
                    src={logo} 
                    alt="HSFIN Logo" 
                    className="h-10 md:h-12 w-auto object-contain"
                    style={{ maxHeight: '48px' }}
                  />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative w-7 h-7 md:w-8 md:h-8 flex flex-col justify-center items-center rounded-lg transition-all duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ml-2 md:ml-4"
                  aria-label="Close menu"
                >
                  <span
                    className="absolute w-3.5 md:w-4 h-0.5 bg-gray-700 rotate-45 transition-all duration-300"
                    style={{ backgroundColor: '#374151' }}
                  ></span>
                  <span
                    className="absolute w-3.5 md:w-4 h-0.5 bg-gray-700 -rotate-45 transition-all duration-300"
                    style={{ backgroundColor: '#374151' }}
                  ></span>
                </button>
              </div>
            </div>
            <nav className="mt-1 md:mt-2">
              {[
                { path: '/dashboard', label: 'Dashboard', icon: '📊' },
                { path: '/daily-debit', label: 'Daily Debit', icon: '💸' },
                { path: '/loan', label: 'Loan', icon: '🏦' },
                { path: '/credit-card', label: 'Credit Card', icon: '💳' },
                { path: '/credit-person', label: 'Credit Person', icon: '➕' },
                { path: '/debit-person', label: 'Debit Person', icon: '➖' },
                { path: '/stock-market', label: 'Stock Market', icon: '📈' },
                { path: '/balance', label: 'Balance', icon: '💰' },
                { path: '/other-note', label: 'Other Note', icon: '📝' },
                { path: '/rules', label: 'Rules', icon: '📋' },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-2 md:px-4 py-2 md:py-2.5 text-xs md:text-sm transition-all duration-200 ${
                    location.pathname === item.path 
                      ? 'text-white font-semibold' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                  style={location.pathname === item.path ? {
                    backgroundColor: '#669bbc',
                    borderRadius: '0.375rem',
                    marginLeft: '0.5rem',
                    marginRight: '0.5rem'
                  } : {
                    borderRadius: '0.375rem',
                    marginLeft: '0.5rem',
                    marginRight: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span className="mr-2 md:mr-3 text-sm md:text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default TopNavbar;

