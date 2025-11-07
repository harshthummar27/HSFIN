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
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const netBalance = summary.totalCreditPerson - summary.totalDebit - summary.totalDebitPerson;

  return (
    <div className="p-2 md:p-6" style={{ backgroundColor: '#f2f4f3', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="mb-3 md:mb-6">
        <h1 className="text-lg md:text-3xl font-bold" style={{ color: '#0A0908' }}>Financial Overview</h1>
        <p className="text-xs md:text-base text-gray-600 mt-0.5 md:mt-1">Complete summary of your finances</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-3 md:mb-6">
        <div className="bg-gradient-to-br from-white to-red-50 p-3 md:p-5 rounded-lg md:rounded-xl shadow-md md:shadow-lg border-l-4 border-red-500 hover:shadow-lg md:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-xs md:text-sm font-semibold uppercase tracking-wide">Daily Debit</h3>
            <span className="text-lg md:text-2xl">💸</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-red-600">₹{summary.totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-gradient-to-br from-white to-green-50 p-3 md:p-5 rounded-lg md:rounded-xl shadow-md md:shadow-lg border-l-4 border-green-500 hover:shadow-lg md:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-xs md:text-sm font-semibold uppercase tracking-wide">Credit Person</h3>
            <span className="text-lg md:text-2xl">➕</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-green-600">₹{summary.totalCreditPerson.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-gradient-to-br from-white to-red-50 p-3 md:p-5 rounded-lg md:rounded-xl shadow-md md:shadow-lg border-l-4 border-red-400 hover:shadow-lg md:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-xs md:text-sm font-semibold uppercase tracking-wide">Debit Person</h3>
            <span className="text-lg md:text-2xl">➖</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-red-500">₹{summary.totalDebitPerson.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-gradient-to-br from-white to-blue-50 p-3 md:p-5 rounded-lg md:rounded-xl shadow-md md:shadow-lg border-l-4 hover:shadow-lg md:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ borderLeftColor: '#49111c' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-xs md:text-sm font-semibold uppercase tracking-wide">Net Balance</h3>
            <span className="text-lg md:text-2xl">💰</span>
          </div>
          <p className={`text-2xl md:text-3xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Additional Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-3 md:mb-6">
        <div className="bg-gradient-to-br from-white to-purple-50 p-3 md:p-5 rounded-lg md:rounded-xl shadow-md md:shadow-lg border-l-4 border-purple-500 hover:shadow-lg md:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-xs md:text-sm font-semibold uppercase tracking-wide">Loan Outstanding</h3>
            <span className="text-lg md:text-2xl">🏦</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-purple-600">
            ₹{summary.loanSummary.reduce((sum, loan) => sum + (loan.totalOutstanding || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-gradient-to-br from-white to-orange-50 p-3 md:p-5 rounded-lg md:rounded-xl shadow-md md:shadow-lg border-l-4 border-orange-500 hover:shadow-lg md:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-xs md:text-sm font-semibold uppercase tracking-wide">Total Outstanding</h3>
            <span className="text-lg md:text-2xl">💳</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-orange-600">
            ₹{summary.creditCardSummary.reduce((sum, card) => sum + (card.currentBalance || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-gradient-to-br from-white to-blue-50 p-3 md:p-5 rounded-lg md:rounded-xl shadow-md md:shadow-lg border-l-4 border-blue-500 hover:shadow-lg md:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-xs md:text-sm font-semibold uppercase tracking-wide">Stock Market Fund</h3>
            <span className="text-lg md:text-2xl">📈</span>
          </div>
          <p className={`text-2xl md:text-3xl font-bold ${summary.stockMarketTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{summary.stockMarketTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-gradient-to-br from-white to-indigo-50 p-3 md:p-5 rounded-lg md:rounded-xl shadow-md md:shadow-lg border-l-4 border-indigo-500 hover:shadow-lg md:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-xs md:text-sm font-semibold uppercase tracking-wide">Total Balance</h3>
            <span className="text-lg md:text-2xl">💵</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-indigo-600">
            ₹{summary.balanceTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Loan Summary */}
      {summary.loanSummary.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3 md:mb-6">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <span className="text-lg md:text-2xl mr-2 md:mr-3">🏦</span>
              <h2 className="text-base md:text-lg font-bold" style={{ color: '#0A0908' }}>Loan Outstanding Summary</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Bank</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Outstanding Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {summary.loanSummary.map((loan, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 md:px-6 py-3 text-sm font-medium" style={{ color: '#0A0908' }}>{loan._id}</td>
                    <td className="px-4 md:px-6 py-3 text-sm font-bold text-purple-600">₹{loan.totalOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Credit Card Summary */}
      {summary.creditCardSummary.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3 md:mb-6">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <span className="text-lg md:text-2xl mr-2 md:mr-3">💳</span>
              <h2 className="text-base md:text-lg font-bold" style={{ color: '#0A0908' }}>Credit Card Summary</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Card Name</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Limit</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Outstanding</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Available Credit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {summary.creditCardSummary.map((card, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 md:px-6 py-3 text-sm font-medium" style={{ color: '#0A0908' }}>{card._id}</td>
                    <td className="px-4 md:px-6 py-3 text-sm" style={{ color: '#0A0908' }}>₹{(card.limit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 md:px-6 py-3 text-sm font-bold text-purple-600">₹{(card.currentBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className={`px-4 md:px-6 py-3 text-sm font-bold ${(card.availableCredit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{(card.availableCredit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

