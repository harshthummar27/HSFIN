import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/HSFIN.png';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
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
  ];

  return (
    <>
      {/* Sidebar - Desktop only */}
      <div
        className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white shadow-md z-40"
      >
        <div className="px-4 py-5 border-b border-gray-200 bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-center justify-center">
            <img 
              src={logo} 
              alt="HSFIN Logo" 
              className="h-12 md:h-14 w-auto object-contain transition-transform duration-300 hover:scale-105"
              style={{ maxHeight: '56px' }}
            />
          </div>
        </div>
        <nav className="mt-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2.5 text-sm transition-all duration-200 ${
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
              <span className="mr-3 text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

    </>
  );
};

export default Sidebar;

