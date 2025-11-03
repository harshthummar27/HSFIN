import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Balance = () => {
  const [initialCashBalance, setInitialCashBalance] = useState(0);
  const [initialAccountBalance, setInitialAccountBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [balanceFormData, setBalanceFormData] = useState({
    initialCashBalance: '',
    initialAccountBalance: ''
  });
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    cashAmount: '',
    accountAmount: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);

  useEffect(() => {
    fetchInitialBalances();
    fetchTransactions();
  }, []);

  const fetchInitialBalances = async () => {
    try {
      const response = await api.get('/balance/initial');
      setInitialCashBalance(response.data.initialCashBalance || 0);
      setInitialAccountBalance(response.data.initialAccountBalance || 0);
      setBalanceFormData({
        initialCashBalance: (response.data.initialCashBalance || 0).toString(),
        initialAccountBalance: (response.data.initialAccountBalance || 0).toString()
      });
    } catch (error) {
      toast.error('Failed to fetch initial balances');
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/balance');
      setTransactions(response.data);
    } catch (error) {
      toast.error('Failed to fetch transactions');
    }
  };

  const handleBalanceSubmit = async (e) => {
    e.preventDefault();
    setBalanceLoading(true);

    try {
      await api.put('/balance/initial', {
        initialCashBalance: balanceFormData.initialCashBalance ? parseFloat(balanceFormData.initialCashBalance) : undefined,
        initialAccountBalance: balanceFormData.initialAccountBalance ? parseFloat(balanceFormData.initialAccountBalance) : undefined
      });
      toast.success('Initial balance updated successfully');
      fetchInitialBalances();
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to update initial balance');
    } finally {
      setBalanceLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/balance', {
        ...formData,
        cashAmount: formData.cashAmount ? parseFloat(formData.cashAmount) : undefined,
        accountAmount: formData.accountAmount ? parseFloat(formData.accountAmount) : undefined
      });
      toast.success('Transaction added successfully');
      setFormData({
        date: new Date().toISOString().split('T')[0],
        cashAmount: '',
        accountAmount: '',
        note: ''
      });
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await api.delete(`/balance/${id}`);
        toast.success('Entry deleted successfully');
        fetchTransactions();
      } catch (error) {
        toast.error('Failed to delete entry');
      }
    }
  };

  // Calculate current balances
  const totalCashTransactions = transactions.reduce((sum, t) => sum + (t.cashAmount || 0), 0);
  const totalAccountTransactions = transactions.reduce((sum, t) => sum + (t.accountAmount || 0), 0);
  const currentCashBalance = initialCashBalance + totalCashTransactions;
  const currentAccountBalance = initialAccountBalance + totalAccountTransactions;
  const totalBalance = currentCashBalance + currentAccountBalance;

  return (
    <div className="p-2 md:p-4">
      {/* Total Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-1">Cash Balance</h3>
          <p className="text-2xl md:text-3xl font-bold text-blue-600">
            ₹{currentCashBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="mt-2 text-xs text-gray-500">
            <p>Initial: ₹{initialCashBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className={totalCashTransactions >= 0 ? 'text-green-600' : 'text-red-600'}>
              Transactions: {(totalCashTransactions >= 0 ? '+' : '')}₹{totalCashTransactions.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-1">Account Balance</h3>
          <p className="text-2xl md:text-3xl font-bold text-green-600">
            ₹{currentAccountBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="mt-2 text-xs text-gray-500">
            <p>Initial: ₹{initialAccountBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className={totalAccountTransactions >= 0 ? 'text-green-600' : 'text-red-600'}>
              Transactions: {(totalAccountTransactions >= 0 ? '+' : '')}₹{totalAccountTransactions.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-1">Total Balance</h3>
          <p className="text-2xl md:text-3xl font-bold text-purple-600">
            ₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Set Initial Balance Form Section */}
      <div className="bg-white p-3 md:p-4 rounded-lg shadow-md mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-2 md:mb-3">Set Initial Balance</h2>
        <form onSubmit={handleBalanceSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Initial Cash Balance</label>
            <input
              type="number"
              step="0.01"
              value={balanceFormData.initialCashBalance}
              onChange={(e) => setBalanceFormData({ ...balanceFormData, initialCashBalance: e.target.value })}
              placeholder="0.00"
              className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Initial Account Balance</label>
            <input
              type="number"
              step="0.01"
              value={balanceFormData.initialAccountBalance}
              onChange={(e) => setBalanceFormData({ ...balanceFormData, initialAccountBalance: e.target.value })}
              placeholder="0.00"
              className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={balanceLoading || (!balanceFormData.initialCashBalance && !balanceFormData.initialAccountBalance)}
              className="w-full text-white text-xs md:text-sm font-semibold py-1.5 md:py-2 px-3 md:px-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50 shadow-md"
              style={{ backgroundColor: '#669bbc' }}
              onMouseEnter={(e) => !balanceLoading && !(!balanceFormData.initialCashBalance && !balanceFormData.initialAccountBalance) && (e.currentTarget.style.backgroundColor = '#5588aa')}
              onMouseLeave={(e) => !balanceLoading && (e.currentTarget.style.backgroundColor = '#669bbc')}
            >
              {balanceLoading ? 'Saving...' : 'Update Balance'}
            </button>
          </div>
        </form>
      </div>

      {/* Add Transaction Form Section */}
      <div className="bg-white p-3 md:p-4 rounded-lg shadow-md mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-2 md:mb-3">Add Transaction (+/-)</h2>
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
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Cash Amount (+/-)</label>
            <input
              type="number"
              step="0.01"
              value={formData.cashAmount}
              onChange={(e) => setFormData({ ...formData, cashAmount: e.target.value })}
              placeholder="+1000 or -500"
              className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Use + for add, - for subtract</p>
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Account Amount (+/-)</label>
            <input
              type="number"
              step="0.01"
              value={formData.accountAmount}
              onChange={(e) => setFormData({ ...formData, accountAmount: e.target.value })}
              placeholder="+1000 or -500"
              className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Use + for add, - for subtract</p>
          </div>
          <div className="flex flex-col gap-2">
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
            <button
              type="submit"
              disabled={loading || (!formData.cashAmount && !formData.accountAmount)}
              className="w-full text-white text-xs md:text-sm font-semibold py-1.5 md:py-2 px-3 md:px-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50 shadow-md"
              style={{ backgroundColor: '#669bbc' }}
              onMouseEnter={(e) => !loading && !(!formData.cashAmount && !formData.accountAmount) && (e.currentTarget.style.backgroundColor = '#5588aa')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#669bbc')}
            >
              {loading ? 'Saving...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>

      {/* Transactions Table Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-3 md:p-4 border-b border-gray-200">
          <h2 className="text-base md:text-lg font-semibold text-gray-700">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs md:text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 md:px-3 py-2 text-left font-medium text-gray-700 uppercase">Date</th>
                <th className="px-2 md:px-3 py-2 text-left font-medium text-gray-700 uppercase">Cash Amount</th>
                <th className="px-2 md:px-3 py-2 text-left font-medium text-gray-700 uppercase">Account Amount</th>
                <th className="px-2 md:px-3 py-2 text-left font-medium text-gray-700 uppercase">Note</th>
                <th className="px-2 md:px-3 py-2 text-left font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((entry) => (
                <tr key={entry._id} className="hover:bg-gray-50">
                  <td className="px-2 md:px-3 py-2 whitespace-nowrap text-gray-900">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className={`px-2 md:px-3 py-2 whitespace-nowrap font-semibold ${
                    (entry.cashAmount || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(entry.cashAmount || 0) !== 0 ? (
                      <>
                        {(entry.cashAmount || 0) >= 0 ? '+' : ''}₹{(entry.cashAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className={`px-2 md:px-3 py-2 whitespace-nowrap font-semibold ${
                    (entry.accountAmount || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(entry.accountAmount || 0) !== 0 ? (
                      <>
                        {(entry.accountAmount || 0) >= 0 ? '+' : ''}₹{(entry.accountAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-2 md:px-3 py-2 text-gray-900">{entry.note || '-'}</td>
                  <td className="px-2 md:px-3 py-2 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="text-red-600 hover:text-red-800 font-medium text-xs md:text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-2 md:px-3 py-3 text-center text-gray-500 text-xs md:text-sm">
                    No transactions found. Add your first transaction above.
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

export default Balance;

