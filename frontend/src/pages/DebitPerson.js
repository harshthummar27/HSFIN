import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const DebitPerson = ({}) => {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    rupees: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await api.get('/debit-person');
      setEntries(response.data);
    } catch (error) {
      toast.error('Failed to fetch debit person entries');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/debit-person', {
        ...formData,
        rupees: parseFloat(formData.rupees)
      });
      toast.success('Debit person entry added successfully');
      setFormData({
        date: new Date().toISOString().split('T')[0],
        rupees: '',
        note: ''
      });
      fetchEntries();
    } catch (error) {
      toast.error('Failed to add debit person entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await api.delete(`/debit-person/${id}`);
        toast.success('Entry deleted successfully');
        fetchEntries();
      } catch (error) {
        toast.error('Failed to delete entry');
      }
    }
  };

  // Calculate total sum
  const totalSum = entries.reduce((sum, entry) => sum + (entry.rupees || 0), 0);

  return (
    <div className="p-2 md:p-6" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="mb-3 md:mb-6">
        <h1 className="text-lg md:text-3xl font-bold" style={{ color: '#003049' }}>Debit Person</h1>
        <p className="text-xs md:text-base text-gray-600 mt-0.5 md:mt-1">Track money you owe to others</p>
      </div>

      {/* Total Sum Card */}
      <div className="bg-gradient-to-br from-white to-red-50 p-3 md:p-5 rounded-lg md:rounded-xl shadow-md md:shadow-lg mb-3 md:mb-6 border-l-4 border-red-500 hover:shadow-lg md:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-600 text-xs md:text-sm font-semibold uppercase tracking-wide">Total Debit Amount</h3>
          <span className="text-lg md:text-2xl">➖</span>
        </div>
        <p className="text-2xl md:text-4xl font-bold text-red-600 mb-1 md:mb-2">₹{totalSum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p className="text-xs md:text-sm text-gray-500">{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</p>
      </div>

      {/* Form Section */}
      <div className="bg-white p-3 md:p-6 rounded-lg md:rounded-xl shadow-md md:shadow-lg mb-3 md:mb-6">
        <div className="flex items-center mb-2 md:mb-4">
          <span className="text-lg md:text-2xl mr-2 md:mr-3">➕</span>
          <h2 className="text-sm md:text-2xl font-bold text-gray-700">Add New Debit Entry</h2>
        </div>
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
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Enter note"
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
      <div className="bg-white rounded-lg md:rounded-xl shadow-md md:shadow-lg overflow-hidden">
        <div className="p-3 md:p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-sm md:text-lg font-bold text-gray-700">Debit Entries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Rupees</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-900">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                 
                  <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-900">{entry.note || '-'}</td>
                   <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-xs md:text-sm font-bold text-red-600">
                    ₹{(entry.rupees || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="text-red-600 hover:text-red-800 font-semibold text-xs md:text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-2 md:px-4 py-4 md:py-8 text-center text-gray-500 text-xs md:text-sm">
                    No debit person entries found
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

export default DebitPerson;

