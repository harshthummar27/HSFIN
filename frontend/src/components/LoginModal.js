import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      toast.success('Login successful!');
      onClose();
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Login failed');
    }
    
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all">
        <div className="flex justify-center mb-4">
          <img 
            src="/HSFIN.png" 
            alt="HSFIN Logo" 
            className="h-12 w-auto object-contain"
            style={{ maxHeight: '48px' }}
          />
        </div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#003049' }}>Login</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" style={{ color: '#003049' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all"
              style={{ 
                borderColor: '#e5e7eb',
                ':focus': { borderColor: '#669bbc' }
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#669bbc'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2" style={{ color: '#003049' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all"
              style={{ borderColor: '#e5e7eb' }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#669bbc'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            style={{ backgroundColor: '#669bbc' }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#5588aa')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#669bbc')}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;

