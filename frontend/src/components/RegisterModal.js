import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/HSFIN.png';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await register(name.trim(), email.trim(), password);
      
      if (result.success) {
        toast.success('Registration successful! Welcome to HSFIN!');
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrors({});
        onClose();
        // Small delay for better UX
        setTimeout(() => {
          navigate('/dashboard');
        }, 300);
      } else {
        const errorMessage = result.message || 'Registration failed. Please try again.';
        toast.error(errorMessage);
        setErrors({ general: errorMessage });
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (errors.name) {
      setErrors({ ...errors, name: '' });
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (errors.email) {
      setErrors({ ...errors, email: '' });
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (errors.password) {
      setErrors({ ...errors, password: '' });
    }
    // Clear confirm password error if passwords now match
    if (errors.confirmPassword && value === confirmPassword) {
      setErrors({ ...errors, confirmPassword: '' });
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (errors.confirmPassword) {
      setErrors({ ...errors, confirmPassword: '' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md transform transition-all relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl transition-colors"
          aria-label="Close"
        >
          ×
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img 
            src={logo} 
            alt="HSFIN Logo" 
            className="h-10 w-auto object-contain"
            style={{ maxHeight: '40px' }}
          />
        </div>

        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="text-xl font-bold" style={{ color: '#0A0908' }}>Create Account</h2>
          <p className="text-sm text-gray-500 mt-1">Join HSfin today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* General Error Message */}
          {errors.general && (
            <div className="mb-4 p-3 rounded-lg text-xs" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
              {errors.general}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#0A0908' }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-all text-sm ${
                errors.name ? 'border-red-300' : ''
              }`}
              style={{ 
                borderColor: errors.name ? '#fca5a5' : '#e5e7eb'
              }}
              onFocus={(e) => {
                if (!errors.name) {
                  e.currentTarget.style.borderColor = '#49111c';
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.name ? '#fca5a5' : '#e5e7eb';
              }}
              placeholder="Enter your full name"
              disabled={loading}
              autoComplete="name"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#0A0908' }}>
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-all text-sm ${
                  errors.email ? 'border-red-300' : ''
                }`}
                style={{ 
                  borderColor: errors.email ? '#fca5a5' : '#e5e7eb'
                }}
                onFocus={(e) => {
                  if (!errors.email) {
                    e.currentTarget.style.borderColor = '#49111c';
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.email ? '#fca5a5' : '#e5e7eb';
                }}
                placeholder="Enter your email"
                disabled={loading}
                autoComplete="email"
              />
              {email && !errors.email && validateEmail(email) && (
                <span className="absolute right-3 top-2.5 text-green-500 text-sm">✓</span>
              )}
            </div>
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#0A0908' }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                className={`w-full px-3 py-2 pr-10 border-2 rounded-lg focus:outline-none transition-all text-sm ${
                  errors.password ? 'border-red-300' : ''
                }`}
                style={{ borderColor: errors.password ? '#fca5a5' : '#e5e7eb' }}
                onFocus={(e) => {
                  if (!errors.password) {
                    e.currentTarget.style.borderColor = '#49111c';
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.password ? '#fca5a5' : '#e5e7eb';
                }}
                placeholder="Enter your password"
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 text-sm focus:outline-none"
                disabled={loading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          <div className="mb-5">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#0A0908' }}>
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full px-3 py-2 pr-10 border-2 rounded-lg focus:outline-none transition-all text-sm ${
                  errors.confirmPassword ? 'border-red-300' : ''
                }`}
                style={{ borderColor: errors.confirmPassword ? '#fca5a5' : '#e5e7eb' }}
                onFocus={(e) => {
                  if (!errors.confirmPassword) {
                    e.currentTarget.style.borderColor = '#49111c';
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.confirmPassword ? '#fca5a5' : '#e5e7eb';
                }}
                placeholder="Confirm your password"
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 text-sm focus:outline-none"
                disabled={loading}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim() || !email.trim() || !password || !confirmPassword}
            className="w-full text-white font-semibold py-2.5 px-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm relative overflow-hidden group"
            style={{ backgroundColor: '#49111c' }}
            onMouseEnter={(e) => !loading && !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#3a0d15')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#49111c')}
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          </button>

          {/* Switch to Login */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-semibold hover:underline transition-all"
                style={{ color: '#49111c' }}
              >
                Login here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;

