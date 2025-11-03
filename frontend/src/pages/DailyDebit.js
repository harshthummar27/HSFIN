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
    <div className="p-2 md:p-4">
      {/* Total Sum Card */}
      <div className="bg-white p-3 md:p-4 rounded-lg shadow-md mb-4 md:mb-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
        <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-1">Total Debit Amount</h3>
        <p className="text-2xl md:text-3xl font-bold text-red-600">₹{totalSum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p className="text-xs md:text-sm text-gray-500 mt-1">{debits.length} {debits.length === 1 ? 'entry' : 'entries'}</p>
      </div>

      {/* Form Section */}
      <div className="bg-white p-3 md:p-4 rounded-lg shadow-md mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-2 md:mb-3">Add New Debit Entry</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Rupees</label>
            <input
              type="number"
              step="0.01"
              value={formData.rupees}
              onChange={(e) => setFormData({ ...formData, rupees: e.target.value })}
              required
              placeholder="0.00"
              className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Note</label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Enter note"
              className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white text-xs md:text-sm font-semibold py-1.5 md:py-2 px-3 md:px-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50 shadow-md"
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs md:text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 md:px-3 py-2 text-left font-medium text-gray-700 uppercase">Date</th>
                <th className="px-2 md:px-3 py-2 text-left font-medium text-gray-700 uppercase">Rupees</th>
                <th className="px-2 md:px-3 py-2 text-left font-medium text-gray-700 uppercase">Note</th>
                <th className="px-2 md:px-3 py-2 text-left font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {debits.map((debit) => (
                <tr key={debit._id} className="hover:bg-gray-50">
                  <td className="px-2 md:px-3 py-2 whitespace-nowrap text-gray-900">
                    {new Date(debit.date).toLocaleDateString()}
                  </td>
                  <td className="px-2 md:px-3 py-2 whitespace-nowrap font-semibold text-red-600">
                    ₹{debit.rupees.toLocaleString()}
                  </td>
                  <td className="px-2 md:px-3 py-2 text-gray-900">{debit.note || '-'}</td>
                  <td className="px-2 md:px-3 py-2 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(debit._id)}
                      className="text-red-600 hover:text-red-800 font-medium text-xs md:text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {debits.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-2 md:px-3 py-4 text-center text-gray-500 text-xs md:text-sm">
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
