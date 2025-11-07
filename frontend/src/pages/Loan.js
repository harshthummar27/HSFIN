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
    <div className="p-2 md:p-6" style={{ backgroundColor: '#f2f4f3', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="mb-3 md:mb-6">
        <h1 className="text-lg md:text-3xl font-bold" style={{ color: '#0A0908' }}>Loan Management</h1>
        <p className="text-xs md:text-base text-gray-600 mt-0.5 md:mt-1">Track and manage your loan EMIs</p>
      </div>

      {/* Total Sum Card */}
      <div className="bg-gradient-to-br from-white to-purple-50 p-3 md:p-5 rounded-lg md:rounded-xl shadow-md md:shadow-lg mb-3 md:mb-6 border-l-4 border-purple-500 hover:shadow-lg md:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-600 text-xs md:text-sm font-semibold uppercase tracking-wide">Total Outstanding Loan Amount</h3>
          <span className="text-lg md:text-2xl">🏦</span>
        </div>
        <p className="text-2xl md:text-4xl font-bold text-purple-600 mb-1 md:mb-2">₹{(totalSum || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p className="text-xs md:text-sm text-gray-500">{loans.length} {loans.length === 1 ? 'EMI pending' : 'EMIs pending'}</p>
      </div>

      {/* Create Loan Button */}
      <div className="mb-3 md:mb-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="text-white text-xs md:text-sm font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all hover:scale-105 shadow-md md:shadow-lg flex items-center gap-2"
            style={{ backgroundColor: '#49111c' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a0d15')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#49111c')}
          >
            <span className="text-lg md:text-xl">➕</span>
            <span>Create a Loan</span>
          </button>
        ) : (
          <div className="bg-white p-3 md:p-6 rounded-lg md:rounded-xl shadow-md md:shadow-lg">
            <div className="flex justify-between items-center mb-2 md:mb-4">
              <div className="flex items-center">
                <span className="text-lg md:text-2xl mr-2 md:mr-3">🏦</span>
                <h2 className="text-sm md:text-2xl font-bold text-gray-700">Create New Loan</h2>
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
                <label className="block text-xs md:text-sm font-semibold mb-1 md:mb-2" style={{ color: '#0A0908' }}>Bank Name</label>
                <input
                  type="text"
                  value={formData.bank}
                  onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                  required
                  placeholder="e.g., HDFC, Axis, SBI"
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
                <label className="block text-xs md:text-sm font-semibold mb-1 md:mb-2" style={{ color: '#0A0908' }}>Repayment Date (EMI)</label>
                <input
                  type="date"
                  value={formData.repaymentDate}
                  onChange={(e) => setFormData({ ...formData, repaymentDate: e.target.value })}
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
                <label className="block text-xs md:text-sm font-semibold mb-1 md:mb-2" style={{ color: '#0A0908' }}>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 text-white text-xs md:text-sm font-semibold py-1.5 md:py-2 px-3 md:px-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50 shadow-md"
                  style={{ backgroundColor: '#49111c' }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#3a0d15')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#49111c')}
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base md:text-lg font-bold" style={{ color: '#0A0908' }}>Loan Entries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Bank Name</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Repayment Date (EMI)</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Amount</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
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
                  <tr key={loan._id} className={`hover:bg-gray-50 transition-colors ${isOverdue ? 'bg-red-50' : ''}`}>
                    <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm font-medium" style={{ color: '#0A0908' }}>
                      {bankName}
                    </td>
                    <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm" style={{ color: '#0A0908' }}>
                      <div>
                        {parsedDate ? parsedDate.toLocaleDateString() : 'N/A'}
                        {isOverdue && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full text-white" style={{ backgroundColor: '#dc2626' }}>Overdue</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm font-bold text-purple-600">
                      ₹{(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 md:px-6 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleEMIPaid(loan._id)}
                        className="px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all hover:scale-105 text-white"
                        style={{ backgroundColor: '#10b981' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                      >
                        EMI Paid
                      </button>
                    </td>
                  </tr>
                );
              })}
              {loans.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 md:px-6 py-8 md:py-12 text-center text-sm" style={{ color: '#5e503f' }}>
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
