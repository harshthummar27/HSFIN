import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalDebit: 0,
    totalCredit: 0,
    totalDebitPerson: 0,
    totalCreditPerson: 0,
    loanSummary: [],
    creditCardSummary: [],
    stockMarketTotal: 0,
    balanceTotal: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await api.get('/dashboard/summary');
      setSummary(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        // Clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/';
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4" style={{ backgroundColor: '#f8fafc' }}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-red-500 hover:shadow-lg transition-shadow">
          <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-1">Daily Debit</h3>
          <p className="text-xl md:text-2xl font-bold text-red-600">₹{summary.totalDebit.toLocaleString()}</p>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-1">Credit Person</h3>
          <p className="text-xl md:text-2xl font-bold text-green-600">₹{summary.totalCreditPerson.toLocaleString()}</p>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-red-400 hover:shadow-lg transition-shadow">
          <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-1">Debit Person</h3>
          <p className="text-xl md:text-2xl font-bold text-red-500">₹{summary.totalDebitPerson.toLocaleString()}</p>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 hover:shadow-lg transition-shadow" style={{ borderLeftColor: '#669bbc' }}>
          <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-1">Net Balance</h3>
          <p className={`text-xl md:text-2xl font-bold ${(summary.totalCreditPerson - summary.totalDebit - summary.totalDebitPerson) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{(summary.totalCreditPerson - summary.totalDebit - summary.totalDebitPerson).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Additional Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-1">Loan Outstanding</h3>
          <p className="text-xl md:text-2xl font-bold text-purple-600">
            ₹{summary.loanSummary.reduce((sum, loan) => sum + (loan.totalOutstanding || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
          <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-1">Credit Card Total Balance</h3>
          <p className="text-xl md:text-2xl font-bold text-orange-600">
            ₹{summary.creditCardSummary.reduce((sum, card) => sum + (card.currentBalance || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-1">Stock Market Fund</h3>
          <p className={`text-xl md:text-2xl font-bold ${summary.stockMarketTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{summary.stockMarketTotal.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
          <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-1">Total Balance</h3>
          <p className="text-xl md:text-2xl font-bold text-indigo-600">
            ₹{summary.balanceTotal.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Loan Summary */}
      {summary.loanSummary.length > 0 && (
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md mb-4 md:mb-6">
          <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-3" style={{ color: '#003049' }}>Loan Outstanding Summary</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 md:px-3 py-1.5 md:py-2 text-left text-xs md:text-sm text-gray-700">Bank</th>
                  <th className="px-2 md:px-3 py-1.5 md:py-2 text-left text-xs md:text-sm text-gray-700">Outstanding Amount</th>
                </tr>
              </thead>
              <tbody>
                {summary.loanSummary.map((loan, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm">{loan._id}</td>
                    <td className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm">₹{loan.totalOutstanding.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Credit Card Summary */}
      {summary.creditCardSummary.length > 0 && (
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md mb-4 md:mb-6">
          <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-3" style={{ color: '#003049' }}>Credit Card Summary</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 md:px-3 py-1.5 md:py-2 text-left text-gray-700">Card Name</th>
                  <th className="px-2 md:px-3 py-1.5 md:py-2 text-left text-gray-700">Limit</th>
                  <th className="px-2 md:px-3 py-1.5 md:py-2 text-left text-gray-700">Current Balance</th>
                  <th className="px-2 md:px-3 py-1.5 md:py-2 text-left text-gray-700">Available Credit</th>
                </tr>
              </thead>
              <tbody>
                {summary.creditCardSummary.map((card, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-2 md:px-3 py-1.5 md:py-2">{card._id}</td>
                    <td className="px-2 md:px-3 py-1.5 md:py-2">₹{(card.limit || 0).toLocaleString()}</td>
                    <td className="px-2 md:px-3 py-1.5 md:py-2 font-semibold text-purple-600">₹{(card.currentBalance || 0).toLocaleString()}</td>
                    <td className={`px-2 md:px-3 py-1.5 md:py-2 font-semibold ${(card.availableCredit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{(card.availableCredit || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

