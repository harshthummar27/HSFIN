import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Loan = () => {
  const [loans, setLoans] = useState([]);
  const [formData, setFormData] = useState({
    bank: '',
    repaymentDate: new Date().toISOString().split('T')[0],
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await api.get('/loan');
      setLoans(response.data);
    } catch (error) {
      toast.error('Failed to fetch loans');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/loan', {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      toast.success('Loan entry added successfully');
      setFormData({
        bank: '',
        repaymentDate: new Date().toISOString().split('T')[0],
        amount: ''
      });
      setShowForm(false);
      fetchLoans();
    } catch (error) {
      toast.error('Failed to add loan entry');
    } finally {
      setLoading(false);
    }
  };

  const handleEMIPaid = async (id) => {
    if (window.confirm('Mark this EMI as paid? This will remove the entry.')) {
      try {
        await api.delete(`/loan/${id}`);
        toast.success('EMI marked as paid and removed');
        fetchLoans();
      } catch (error) {
        toast.error('Failed to mark EMI as paid');
      }
    }
  };

  // Calculate total sum - handle both new and old data structure
  const totalSum = loans.reduce((sum, loan) => {
    const amount = loan.amount || loan.outstandingAmount || 0;
    return sum + (parseFloat(amount) || 0);
  }, 0);

  return (
    <div className="p-4 md:p-6" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#003049' }}>Loan Management</h1>
        <p className="text-gray-600 mt-1">Track and manage your loan EMIs</p>
      </div>

      {/* Total Sum Card */}
      <div className="bg-gradient-to-br from-white to-purple-50 p-5 rounded-xl shadow-lg mb-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Outstanding Loan Amount</h3>
          <span className="text-2xl">🏦</span>
        </div>
        <p className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">₹{(totalSum || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p className="text-sm text-gray-500">{loans.length} {loans.length === 1 ? 'EMI pending' : 'EMIs pending'}</p>
      </div>

      {/* Create Loan Button */}
      <div className="mb-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="text-white text-sm font-semibold py-3 px-6 rounded-lg transition-all hover:scale-105 shadow-lg flex items-center gap-2"
            style={{ backgroundColor: '#669bbc' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5588aa')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#669bbc')}
          >
            <span className="text-xl">➕</span>
            <span>Create a Loan</span>
          </button>
        ) : (
          <div className="bg-white p-5 md:p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🏦</span>
                <h2 className="text-xl md:text-2xl font-bold text-gray-700">Create New Loan</h2>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    bank: '',
                    repaymentDate: new Date().toISOString().split('T')[0],
                    amount: ''
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={formData.bank}
                  onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                  required
                  placeholder="e.g., HDFC, Axis, SBI"
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Repayment Date (EMI)</label>
                <input
                  type="date"
                  value={formData.repaymentDate}
                  onChange={(e) => setFormData({ ...formData, repaymentDate: e.target.value })}
                  required
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  placeholder="0.00"
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 text-white text-xs md:text-sm font-semibold py-1.5 md:py-2 px-3 md:px-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50 shadow-md"
                  style={{ backgroundColor: '#669bbc' }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#5588aa')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#669bbc')}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      bank: '',
                      repaymentDate: new Date().toISOString().split('T')[0],
                      amount: ''
                    });
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white text-xs md:text-sm font-semibold py-1.5 md:py-2 px-3 md:px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-lg font-bold text-gray-700">Loan Entries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Bank Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Repayment Date (EMI)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loans.map((loan) => {
                // Handle old data structure or missing fields
                const amount = loan.amount || loan.outstandingAmount || 0;
                const repaymentDate = loan.repaymentDate || loan.date;
                const bankName = loan.bank || 'N/A';
                
                // Safely parse date
                let parsedDate = null;
                let isOverdue = false;
                
                if (repaymentDate) {
                  try {
                    parsedDate = new Date(repaymentDate);
                    if (!isNaN(parsedDate.getTime())) {
                      isOverdue = parsedDate < new Date();
                    }
                  } catch (e) {
                    // Invalid date
                  }
                }
                
                return (
                  <tr key={loan._id} className={`hover:bg-gray-50 ${isOverdue ? 'bg-red-50' : ''}`}>
                    <td className="px-2 md:px-3 py-2 whitespace-nowrap font-medium text-gray-900">
                      {bankName}
                    </td>
                    <td className="px-2 md:px-3 py-2 whitespace-nowrap text-gray-900">
                      <div>
                        {parsedDate ? parsedDate.toLocaleDateString() : 'N/A'}
                        {isOverdue && (
                          <span className="ml-1 text-xs text-red-600 font-semibold">(Overdue)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-2 md:px-3 py-2 whitespace-nowrap font-semibold text-purple-600">
                      ₹{(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-2 md:px-3 py-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEMIPaid(loan._id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm font-semibold py-1 md:py-1.5 px-2 md:px-3 rounded-lg transition-colors"
                      >
                        EMI Paid
                      </button>
                    </td>
                  </tr>
                );
              })}
              {loans.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-2 md:px-3 py-3 text-center text-gray-500 text-xs md:text-sm">
                    No loan entries found. Click "Create a Loan" to add your first loan.
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

export default Loan;
