import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const MonthlyIncome = () => {
  const [monthlyIncomes, setMonthlyIncomes] = useState([]);
  const [formData, setFormData] = useState({
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear(),
    rupees: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchMonthlyIncomes();
  }, []);

  const fetchMonthlyIncomes = async () => {
    try {
      const response = await api.get('/monthly-income');
      setMonthlyIncomes(response.data);
    } catch (error) {
      toast.error('Failed to fetch monthly income entries');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/monthly-income', {
        ...formData,
        rupees: parseFloat(formData.rupees)
      });
      toast.success('Monthly income entry added successfully');
      setFormData({
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear(),
        rupees: '',
        note: ''
      });
      fetchMonthlyIncomes();
    } catch (error) {
      toast.error('Failed to add monthly income entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await api.delete(`/monthly-income/${id}`);
        toast.success('Entry deleted successfully');
        fetchMonthlyIncomes();
      } catch (error) {
        toast.error('Failed to delete entry');
      }
    }
  };

  // Calculate total sum
  const totalSum = monthlyIncomes.reduce((sum, income) => sum + (income.rupees || 0), 0);

  return (
    <div className="p-2 md:p-6" style={{ backgroundColor: '#f2f4f3', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="mb-3 md:mb-6">
        <h1 className="text-lg md:text-3xl font-bold" style={{ color: '#0A0908' }}>Monthly Income</h1>
        <p className="text-xs md:text-base text-gray-600 mt-0.5 md:mt-1">Track your monthly income</p>
      </div>

      {/* Total Sum Card */}
      <div className="bg-gradient-to-br from-white to-green-50 p-3 md:p-5 rounded-lg md:rounded-xl shadow-md md:shadow-lg mb-3 md:mb-6 border-l-4 border-green-500 hover:shadow-lg md:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-600 text-xs md:text-sm font-semibold uppercase tracking-wide">Total Monthly Income Amount</h3>
          <span className="text-lg md:text-2xl">💰</span>
        </div>
        <p className="text-2xl md:text-4xl font-bold text-green-600 mb-1 md:mb-2">₹{totalSum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p className="text-xs md:text-sm text-gray-500">{monthlyIncomes.length} {monthlyIncomes.length === 1 ? 'entry' : 'entries'}</p>
      </div>

      {/* Form Section */}
      <div className="bg-white p-3 md:p-6 rounded-lg md:rounded-xl shadow-md md:shadow-lg mb-3 md:mb-6">
        <div className="flex items-center mb-2 md:mb-4">
          <span className="text-lg md:text-2xl mr-2 md:mr-3">➕</span>
          <h2 className="text-sm md:text-2xl font-bold text-gray-700">Add New Monthly Income Entry</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-semibold mb-1 md:mb-2" style={{ color: '#0A0908' }}>Month</label>
            <select
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
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
            >
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs md:text-sm font-semibold mb-1 md:mb-2" style={{ color: '#0A0908' }}>Year</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              required
              min="2000"
              max="2100"
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
            <label className="block text-xs md:text-sm font-semibold mb-1 md:mb-2" style={{ color: '#0A0908' }}>Rupees</label>
            <input
              type="number"
              step="0.01"
              value={formData.rupees}
              onChange={(e) => setFormData({ ...formData, rupees: e.target.value })}
              required
              placeholder="0.00"
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
              placeholder="Enter note"
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
              className="w-full text-white text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-3 md:px-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50 shadow-md md:shadow-lg"
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
          <h2 className="text-base md:text-lg font-bold" style={{ color: '#0A0908' }}>Monthly Income Entries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Month</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Year</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Rupees</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Note</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {monthlyIncomes.map((income) => (
                <tr key={income._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm font-medium" style={{ color: '#0A0908' }}>
                    {income.month}
                  </td>
                  <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm" style={{ color: '#0A0908' }}>
                    {income.year}
                  </td>
                  <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm font-bold text-green-600">
                    ₹{income.rupees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 md:px-6 py-3 text-sm" style={{ color: '#0A0908' }}>{income.note || '-'}</td>
                  <td className="px-4 md:px-6 py-3 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(income._id)}
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
              {monthlyIncomes.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 md:px-6 py-8 md:py-12 text-center text-sm" style={{ color: '#5e503f' }}>
                    No monthly income entries found
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

export default MonthlyIncome;

