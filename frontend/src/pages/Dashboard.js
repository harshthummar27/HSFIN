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
    <div className="p-2 md:p-6" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="mb-3 md:mb-6">
        <h1 className="text-lg md:text-3xl font-bold" style={{ color: '#003049' }}>Financial Overview</h1>
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
        <div className="bg-gradient-to-br from-white to-blue-50 p-3 md:p-5 rounded-lg md:rounded-xl shadow-md md:shadow-lg border-l-4 hover:shadow-lg md:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ borderLeftColor: '#669bbc' }}>
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
        <div className="bg-white p-3 md:p-6 rounded-lg md:rounded-xl shadow-md md:shadow-lg mb-3 md:mb-6">
          <div className="flex items-center mb-2 md:mb-4">
            <span className="text-lg md:text-2xl mr-2 md:mr-3">🏦</span>
            <h2 className="text-sm md:text-2xl font-bold" style={{ color: '#003049' }}>Loan Outstanding Summary - {}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Bank</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Outstanding Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {summary.loanSummary.map((loan, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium text-gray-900">{loan._id}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-bold text-purple-600">₹{loan.totalOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Credit Card Summary */}
      {summary.creditCardSummary.length > 0 && (
        <div className="bg-white p-3 md:p-6 rounded-lg md:rounded-xl shadow-md md:shadow-lg mb-3 md:mb-6">
          <div className="flex items-center mb-2 md:mb-4">
            <span className="text-lg md:text-2xl mr-2 md:mr-3">💳</span>
            <h2 className="text-sm md:text-2xl font-bold" style={{ color: '#003049' }}>Credit Card Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Card Name</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Limit</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">totalOutstanding</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Available Credit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {summary.creditCardSummary.map((card, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium text-gray-900">{card._id}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700">₹{(card.limit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-bold text-purple-600">₹{(card.currentBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className={`px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-bold ${(card.availableCredit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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

