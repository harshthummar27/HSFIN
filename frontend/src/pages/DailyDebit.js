import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const DailyDebit = () => {
  const [debits, setDebits] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    rupees: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDebits();
  }, []);

  const fetchDebits = async () => {
    try {
      const response = await api.get('/debit');
      setDebits(response.data);
    } catch (error) {
      toast.error('Failed to fetch debit entries');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/debit', {
        ...formData,
        rupees: parseFloat(formData.rupees)
      });
      toast.success('Debit entry added successfully');
      setFormData({
        date: new Date().toISOString().split('T')[0],
        rupees: '',
        note: ''
      });
      fetchDebits();
    } catch (error) {
      toast.error('Failed to add debit entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await api.delete(`/debit/${id}`);
        toast.success('Entry deleted successfully');
        fetchDebits();
      } catch (error) {
        toast.error('Failed to delete entry');
      }
    }
  };

  // Calculate total sum
  const totalSum = debits.reduce((sum, debit) => sum + (debit.rupees || 0), 0);

  return (
    <div className="p-4 md:p-6" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#003049' }}>Daily Debit</h1>
        <p className="text-gray-600 mt-1">Track your daily expenses</p>
      </div>

      {/* Total Sum Card */}
      <div className="bg-gradient-to-br from-white to-red-50 p-5 rounded-xl shadow-lg mb-6 border-l-4 border-red-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Debit Amount</h3>
          <span className="text-2xl">💸</span>
        </div>
        <p className="text-3xl md:text-4xl font-bold text-red-600 mb-2">₹{totalSum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p className="text-sm text-gray-500">{debits.length} {debits.length === 1 ? 'entry' : 'entries'}</p>
      </div>

      {/* Form Section */}
      <div className="bg-white p-5 md:p-6 rounded-xl shadow-lg mb-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">➕</span>
          <h2 className="text-xl md:text-2xl font-bold text-gray-700">Add New Debit Entry</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-4 py-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Rupees</label>
            <input
              type="number"
              step="0.01"
              value={formData.rupees}
              onChange={(e) => setFormData({ ...formData, rupees: e.target.value })}
              required
              placeholder="0.00"
              className="w-full px-4 py-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Note</label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Enter note"
              className="w-full px-4 py-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50 shadow-lg"
              style={{ backgroundColor: '#669bbc' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#5588aa')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#669bbc')}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-lg font-bold text-gray-700">Debit Entries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Rupees</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Note</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {debits.map((debit) => (
                <tr key={debit._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {new Date(debit.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-red-600">
                    ₹{debit.rupees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{debit.note || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(debit._id)}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {debits.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500 text-sm">
                    No debit entries found
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

export default DailyDebit;
