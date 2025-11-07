import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const StockMarket = () => {
  const [entries, setEntries] = useState([]);
  const [initialBalance, setInitialBalance] = useState(0);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    profitLoss: '',
    note: ''
  });
  const [balanceFormData, setBalanceFormData] = useState({
    initialBalance: ''
  });
  const [loading, setLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
    fetchBalance();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await api.get('/stock-market');
      setEntries(response.data);
    } catch (error) {
      toast.error('Failed to fetch stock market entries');
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await api.get('/stock-market/balance');
      const balance = response.data.initialBalance || 0;
      setInitialBalance(balance);
      setBalanceFormData({ initialBalance: balance.toString() });
    } catch (error) {
      // If no balance found, that's okay
      setInitialBalance(0);
      setBalanceFormData({ initialBalance: '0' });
    }
  };

  const handleBalanceSubmit = async (e) => {
    e.preventDefault();
    setBalanceLoading(true);

    try {
      await api.put('/stock-market/balance', {
        initialBalance: parseFloat(balanceFormData.initialBalance)
      });
      toast.success('Balance updated successfully');
      fetchBalance();
      fetchEntries();
    } catch (error) {
      toast.error('Failed to update balance');
    } finally {
      setBalanceLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/stock-market', {
        ...formData,
        profitLoss: parseFloat(formData.profitLoss)
      });
      toast.success('Stock market entry added successfully');
      setFormData({
        date: new Date().toISOString().split('T')[0],
        profitLoss: '',
        note: ''
      });
      fetchEntries();
    } catch (error) {
      toast.error('Failed to add stock market entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await api.delete(`/stock-market/${id}`);
        toast.success('Entry deleted successfully');
        fetchEntries();
      } catch (error) {
        toast.error('Failed to delete entry');
      }
    }
  };

  // Calculate total fund
  const totalProfitLoss = entries.reduce((sum, entry) => sum + (entry.profitLoss || 0), 0);
  const totalFund = initialBalance + totalProfitLoss;

  return (
    <div className="p-2 md:p-6" style={{ backgroundColor: '#f2f4f3', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="mb-3 md:mb-6">
        <h1 className="text-lg md:text-3xl font-bold" style={{ color: '#0A0908' }}>Stock Market</h1>
        <p className="text-xs md:text-base text-gray-600 mt-0.5 md:mt-1">Track your stock market investments and profits</p>
      </div>

      {/* Total Fund Card */}
      <div className={`bg-gradient-to-br from-white ${totalFund >= 0 ? 'to-green-50' : 'to-red-50'} p-3 md:p-5 rounded-lg md:rounded-xl shadow-md md:shadow-lg mb-3 md:mb-6 border-l-4 ${totalFund >= 0 ? 'border-green-500' : 'border-red-500'} hover:shadow-lg md:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-600 text-xs md:text-sm font-semibold uppercase tracking-wide">Total Fund</h3>
          <span className="text-lg md:text-2xl">📈</span>
        </div>
        <p className={`text-2xl md:text-4xl font-bold mb-1 md:mb-2 ${totalFund >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ₹{totalFund.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <div className="mt-2 text-xs md:text-sm text-gray-600 space-y-1">
          <p>Initial Balance: <span className="font-semibold">₹{initialBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          <p>Total P/L: 
            <span className={`font-semibold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {' '}₹{totalProfitLoss.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </p>
        </div>
      </div>

      {/* Balance Form Section */}
      <div className="bg-white p-3 md:p-4 rounded-lg md:rounded-xl shadow-md md:shadow-lg mb-3 md:mb-6">
        <h2 className="text-sm md:text-lg font-semibold text-gray-700 mb-2 md:mb-3">Set Initial Balance</h2>
        <form onSubmit={handleBalanceSubmit} className="flex gap-2 md:gap-3">
          <div className="flex-1">
            <label className="block text-xs md:text-sm font-semibold mb-1 md:mb-2" style={{ color: '#0A0908' }}>Initial Balance</label>
            <input
              type="number"
              step="0.01"
              value={balanceFormData.initialBalance}
              onChange={(e) => setBalanceFormData({ initialBalance: e.target.value })}
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
          <div className="flex items-end">
            <button
              type="submit"
              disabled={balanceLoading}
              className="text-white text-xs md:text-sm font-semibold py-1.5 md:py-2 px-3 md:px-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50 shadow-md"
              style={{ backgroundColor: '#49111c' }}
              onMouseEnter={(e) => !balanceLoading && (e.currentTarget.style.backgroundColor = '#3a0d15')}
              onMouseLeave={(e) => !balanceLoading && (e.currentTarget.style.backgroundColor = '#49111c')}
            >
              {balanceLoading ? 'Saving...' : 'Update Balance'}
            </button>
          </div>
        </form>
      </div>

      {/* Profit/Loss Form Section */}
      <div className="bg-white p-3 md:p-4 rounded-lg md:rounded-xl shadow-md md:shadow-lg mb-3 md:mb-6">
        <h2 className="text-sm md:text-lg font-semibold text-gray-700 mb-2 md:mb-3">Add Profit/Loss Entry</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3">
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
            <label className="block text-xs md:text-sm font-semibold mb-1 md:mb-2" style={{ color: '#0A0908' }}>Profit/Loss</label>
            <input
              type="number"
              step="0.01"
              value={formData.profitLoss}
              onChange={(e) => setFormData({ ...formData, profitLoss: e.target.value })}
              required
              placeholder="+1000 or -500"
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
            <p className="text-xs text-gray-500 mt-1">Use + for profit, - for loss</p>
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
          <h2 className="text-base md:text-lg font-bold" style={{ color: '#0A0908' }}>Profit/Loss Entries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Date</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Profit/Loss</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Note</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entries.map((entry) => (
                <tr key={entry._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm" style={{ color: '#0A0908' }}>
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className={`px-4 md:px-6 py-3 whitespace-nowrap text-sm font-bold ${
                    (entry.profitLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(entry.profitLoss || 0) >= 0 ? '+' : ''}₹{(entry.profitLoss || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 md:px-6 py-3 text-sm" style={{ color: '#0A0908' }}>{entry.note || '-'}</td>
                  <td className="px-4 md:px-6 py-3 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(entry._id)}
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
              {entries.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 md:px-6 py-8 md:py-12 text-center text-sm" style={{ color: '#5e503f' }}>
                    No profit/loss entries found. Add your first entry above.
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

export default StockMarket;

