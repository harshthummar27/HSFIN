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
  const [bulkFormData, setBulkFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false); // Default: false = Single Entry form shown

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

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!bulkFormData.amount || parseFloat(bulkFormData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setBulkLoading(true);
    try {
      await api.post('/debit/bulk', {
        month: parseInt(bulkFormData.month),
        year: parseInt(bulkFormData.year),
        amount: parseFloat(bulkFormData.amount),
        note: bulkFormData.note
      });
      const monthName = new Date(bulkFormData.year, bulkFormData.month - 1).toLocaleString('default', { month: 'long' });
      toast.success(`Monthly entries created for ${monthName} ${bulkFormData.year}`);
      setBulkFormData({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        amount: '',
        note: ''
      });
      setShowBulkForm(false);
      fetchDebits();
    } catch (error) {
      toast.error('Failed to create monthly entries');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete ALL debit entries? This action cannot be undone.')) {
      try {
        await api.delete('/debit/all');
        toast.success('All debit entries deleted successfully');
        fetchDebits();
      } catch (error) {
        toast.error('Failed to delete all entries');
      }
    }
  };

  // Calculate total sum
  const totalSum = debits.reduce((sum, debit) => sum + (debit.rupees || 0), 0);

  // Calculate monthly totals
  const monthlyTotals = debits.reduce((acc, debit) => {
    const date = new Date(debit.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthName,
        year: year,
        total: 0,
        count: 0
      };
    }
    acc[monthKey].total += debit.rupees || 0;
    acc[monthKey].count += 1;
    return acc;
  }, {});

  const sortedMonthlyTotals = Object.values(monthlyTotals).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months.indexOf(b.month) - months.indexOf(a.month);
  });

  return (
    <div className="p-2 md:p-6" style={{ backgroundColor: '#f2f4f3', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="mb-3 md:mb-6">
        <h1 className="text-lg md:text-3xl font-bold" style={{ color: '#0A0908' }}>Daily Debit</h1>
        <p className="text-xs md:text-base text-gray-600 mt-0.5 md:mt-1">Track your daily expenses</p>
      </div>

      {/* Total Sum Card */}
      <div className="bg-gradient-to-br from-white to-red-50 p-3 md:p-5 rounded-lg md:rounded-xl shadow-md md:shadow-lg mb-3 md:mb-6 border-l-4 border-red-500 hover:shadow-lg md:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-600 text-xs md:text-sm font-semibold uppercase tracking-wide">Total Debit Amount</h3>
          <span className="text-lg md:text-2xl">💸</span>
        </div>
        <p className="text-2xl md:text-4xl font-bold text-red-600 mb-1 md:mb-2">₹{totalSum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p className="text-xs md:text-sm text-gray-500">{debits.length} {debits.length === 1 ? 'entry' : 'entries'}</p>
      </div>

      {/* Form Section */}
      <div className="bg-white p-3 md:p-6 rounded-lg md:rounded-xl shadow-md md:shadow-lg mb-3 md:mb-6">
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <div className="flex items-center">
            <span className="text-lg md:text-2xl mr-2 md:mr-3">➕</span>
            <h2 className="text-sm md:text-2xl font-bold text-gray-700">
              {showBulkForm ? 'Add Monthly Debit Entries' : 'Add New Debit Entry'}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowBulkForm(!showBulkForm)}
              className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold rounded-lg transition-all hover:scale-105 text-white"
              style={{ backgroundColor: showBulkForm ? '#5e503f' : '#49111c' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = showBulkForm ? '#4a3f32' : '#3a0d15'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = showBulkForm ? '#5e503f' : '#49111c'}
            >
              {showBulkForm ? '← Single Entry' : 'Monthly Entry →'}
            </button>
            {debits.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold rounded-lg transition-all hover:scale-105 text-white"
                style={{ backgroundColor: '#dc2626' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              >
                Delete All
              </button>
            )}
          </div>
        </div>
        
        {showBulkForm ? (
          <form onSubmit={handleBulkSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-semibold mb-1 md:mb-2" style={{ color: '#0A0908' }}>Month</label>
              <select
                value={bulkFormData.month}
                onChange={(e) => setBulkFormData({ ...bulkFormData, month: e.target.value })}
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
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            <div>
              <label className="block text-xs md:text-sm font-semibold mb-1 md:mb-2" style={{ color: '#0A0908' }}>Year</label>
              <input
                type="number"
                value={bulkFormData.year}
                onChange={(e) => setBulkFormData({ ...bulkFormData, year: e.target.value })}
                required
                min="2020"
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
              <label className="block text-xs md:text-sm font-semibold mb-1 md:mb-2" style={{ color: '#0A0908' }}>Total Amount</label>
              <input
                type="number"
                step="0.01"
                value={bulkFormData.amount}
                onChange={(e) => setBulkFormData({ ...bulkFormData, amount: e.target.value })}
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
              <p className="text-xs text-gray-500 mt-1">Will be divided by days in month</p>
            </div>
            <div>
              <label className="block text-xs md:text-sm font-semibold mb-1 md:mb-2" style={{ color: '#0A0908' }}>Note (Optional)</label>
              <input
                type="text"
                value={bulkFormData.note}
                onChange={(e) => setBulkFormData({ ...bulkFormData, note: e.target.value })}
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
                disabled={bulkLoading}
                className="w-full text-white text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-3 md:px-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50 shadow-md md:shadow-lg"
                style={{ backgroundColor: '#49111c' }}
                onMouseEnter={(e) => !bulkLoading && (e.currentTarget.style.backgroundColor = '#3a0d15')}
                onMouseLeave={(e) => !bulkLoading && (e.currentTarget.style.backgroundColor = '#49111c')}
              >
                {bulkLoading ? 'Creating...' : 'Create Month'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
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
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base md:text-lg font-bold" style={{ color: '#0A0908' }}>Debit Entries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Date</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Rupees</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Note</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {debits.map((debit) => (
                <tr key={debit._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm" style={{ color: '#0A0908' }}>
                    {new Date(debit.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm font-bold text-red-600">
                    ₹{debit.rupees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 md:px-6 py-3 text-sm" style={{ color: '#0A0908' }}>{debit.note || '-'}</td>
                  <td className="px-4 md:px-6 py-3 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(debit._id)}
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
              {debits.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 md:px-6 py-8 md:py-12 text-center text-sm" style={{ color: '#5e503f' }}>
                    No debit entries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Totals Section */}
      {sortedMonthlyTotals.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-3 md:mt-6">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200">
            <h2 className="text-base md:text-lg font-bold" style={{ color: '#0A0908' }}>Monthly Totals</h2>
          </div>
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {sortedMonthlyTotals.map((monthData, index) => (
                <div
                  key={`${monthData.year}-${monthData.month}`}
                  className="bg-gradient-to-br from-white to-gray-50 p-3 md:p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm md:text-base font-semibold" style={{ color: '#0A0908' }}>
                      {monthData.month} {monthData.year}
                    </h3>
                    <span className="text-xs text-gray-500">{monthData.count} entries</span>
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-red-600">
                    ₹{monthData.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyDebit;
