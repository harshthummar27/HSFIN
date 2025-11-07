import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Rules = () => {
  const [rules, setRules] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    note: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await api.get('/rules');
      setRules(response.data);
    } catch (error) {
      toast.error('Failed to fetch rules');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/rules', formData);
      toast.success('Rule added successfully');
      setFormData({
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
      fetchRules();
    } catch (error) {
      toast.error('Failed to add rule');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      try {
        await api.delete(`/rules/${id}`);
        toast.success('Rule deleted successfully');
        fetchRules();
      } catch (error) {
        toast.error('Failed to delete rule');
      }
    }
  };

  return (
    <div className="p-2 md:p-6" style={{ backgroundColor: '#f2f4f3', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="mb-3 md:mb-6">
        <h1 className="text-lg md:text-3xl font-bold" style={{ color: '#0A0908' }}>Rules</h1>
        <p className="text-xs md:text-base text-gray-600 mt-0.5 md:mt-1">Manage your financial rules and guidelines</p>
      </div>

      {/* Form Section */}
      <div className="bg-white p-3 md:p-6 rounded-lg md:rounded-xl shadow-md md:shadow-lg mb-3 md:mb-6">
        <div className="flex items-center mb-2 md:mb-4">
          <span className="text-lg md:text-2xl mr-2 md:mr-3">📋</span>
          <h2 className="text-sm md:text-2xl font-bold text-gray-700">Add New Rule</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-semibold mb-1 md:mb-2" style={{ color: '#0A0908' }}>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm border border-gray-200 rounded-lg focus:outline-none transition-all bg-white"
              style={{ color: '#0A0908' }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#49111c';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(73, 17, 28, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-semibold mb-1 md:mb-2" style={{ color: '#0A0908' }}>Note</label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              required
              placeholder="Enter rule note"
              className="w-full px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm border border-gray-200 rounded-lg focus:outline-none transition-all bg-white"
              style={{ color: '#0A0908' }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#49111c';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(73, 17, 28, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white text-xs md:text-sm font-semibold py-1.5 md:py-2 px-3 md:px-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50 shadow-md"
              style={{ backgroundColor: '#49111c' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#3a0d15')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#49111c')}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base md:text-lg font-bold" style={{ color: '#0A0908' }}>All Rules</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Date</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Note</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rules.map((rule) => (
                <tr key={rule._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm" style={{ color: '#0A0908' }}>
                    {new Date(rule.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 md:px-6 py-3 text-sm" style={{ color: '#0A0908' }}>{rule.note}</td>
                  <td className="px-4 md:px-6 py-3 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(rule._id)}
                      className="px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all hover:scale-105 text-white"
                      style={{ backgroundColor: '#dc2626' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {rules.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-4 md:px-6 py-8 md:py-12 text-center text-sm" style={{ color: '#5e503f' }}>
                    No rules found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Rules;

