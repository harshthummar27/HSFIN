import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const CreditCard = () => {
  const [cards, setCards] = useState([]);
  const [selectedCard1, setSelectedCard1] = useState('');
  const [selectedCard2, setSelectedCard2] = useState('');
  const [entries1, setEntries1] = useState([]);
  const [entries2, setEntries2] = useState([]);
  const [limit1, setLimit1] = useState(0);
  const [limit2, setLimit2] = useState(0);
  const [formData, setFormData] = useState({
    cardName: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    note: '',
    transactionType: 'spent'
  });
  const [limitFormData, setLimitFormData] = useState({
    limit: ''
  });
  const [loading, setLoading] = useState(false);
  const [limitLoading, setLimitLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showLimitForm, setShowLimitForm] = useState(false);
  const [activeCard, setActiveCard] = useState('');

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    if (selectedCard1) {
      fetchEntriesByCard(selectedCard1, setEntries1);
      fetchLimit(selectedCard1, setLimit1);
    } else {
      setEntries1([]);
      setLimit1(0);
    }
  }, [selectedCard1]);

  useEffect(() => {
    if (selectedCard2) {
      fetchEntriesByCard(selectedCard2, setEntries2);
      fetchLimit(selectedCard2, setLimit2);
    } else {
      setEntries2([]);
      setLimit2(0);
    }
  }, [selectedCard2]);

  const fetchCards = async () => {
    try {
      const response = await api.get('/creditcard/cards');
      setCards(response.data);
    } catch (error) {
      setCards([]);
    }
  };

  const fetchEntriesByCard = async (cardName, setter) => {
    try {
      const response = await api.get(`/creditcard/card/${cardName}`);
      setter(response.data);
    } catch (error) {
      toast.error('Failed to fetch credit card entries');
    }
  };

  const fetchLimit = async (cardName, setter) => {
    try {
      const response = await api.get(`/creditcard/limit/${cardName}`);
      setter(response.data.limit || 0);
      setLimitFormData({ limit: (response.data.limit || 0).toString() });
    } catch (error) {
      setter(0);
    }
  };

  const handleLimitSubmit = async (e) => {
    e.preventDefault();
    setLimitLoading(true);

    try {
      await api.put(`/creditcard/limit/${activeCard}`, {
        limit: parseFloat(limitFormData.limit)
      });
      toast.success('Credit limit updated successfully');
      setLimitFormData({ limit: '' });
      setShowLimitForm(false);
      if (activeCard === selectedCard1) {
        fetchLimit(selectedCard1, setLimit1);
      } else if (activeCard === selectedCard2) {
        fetchLimit(selectedCard2, setLimit2);
      }
    } catch (error) {
      toast.error('Failed to update credit limit');
    } finally {
      setLimitLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For spend entries, make amount negative; for payment, keep positive
      let amount = parseFloat(formData.amount);
      if (formData.transactionType === 'spent') {
        amount = -Math.abs(amount); // Always negative for spend
      } else {
        amount = Math.abs(amount); // Always positive for payment
      }

      await api.post('/creditcard', {
        ...formData,
        amount: amount
      });
      toast.success('Transaction added successfully');
      setFormData({
        cardName: activeCard,
        date: new Date().toISOString().split('T')[0],
        amount: '',
        note: '',
        transactionType: 'spent'
      });
      setShowForm(false);
      fetchCards();
      if (activeCard === selectedCard1) {
        fetchEntriesByCard(selectedCard1, setEntries1);
      } else if (activeCard === selectedCard2) {
        fetchEntriesByCard(selectedCard2, setEntries2);
      }
    } catch (error) {
      toast.error('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, cardName) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await api.delete(`/creditcard/${id}`);
        toast.success('Entry deleted successfully');
        if (cardName === selectedCard1) {
          fetchEntriesByCard(selectedCard1, setEntries1);
        } else if (cardName === selectedCard2) {
          fetchEntriesByCard(selectedCard2, setEntries2);
        }
        fetchCards();
      } catch (error) {
        toast.error('Failed to delete entry');
      }
    }
  };

  const openForm = (cardName) => {
    setActiveCard(cardName);
    setFormData({
      ...formData,
      cardName
    });
    setShowForm(true);
  };

  const openLimitForm = (cardName) => {
    setActiveCard(cardName);
    if (cardName === selectedCard1) {
      setLimitFormData({ limit: limit1.toString() });
    } else if (cardName === selectedCard2) {
      setLimitFormData({ limit: limit2.toString() });
    }
    setShowLimitForm(true);
  };

  // Calculate totals for each card
  const calculateCardSummary = (entries, limit) => {
    const totalSpent = entries.reduce((sum, entry) => {
      const amount = entry.amount || 0;
      return sum + (amount < 0 ? Math.abs(amount) : 0); // Only count negative (spend) amounts
    }, 0);
    const totalPaid = entries.reduce((sum, entry) => {
      const amount = entry.amount || 0;
      return sum + (amount > 0 ? amount : 0); // Only count positive (payment) amounts
    }, 0);
    const currentBalance = totalSpent - totalPaid;
    const availableCredit = limit - currentBalance;
    
    return { totalSpent, totalPaid, currentBalance, availableCredit };
  };

  const card1Summary = selectedCard1 ? calculateCardSummary(entries1, limit1) : null;
  const card2Summary = selectedCard2 ? calculateCardSummary(entries2, limit2) : null;

  return (
    <div className="p-2 md:p-4">
      {/* Card Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md">
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Select Credit Card 1</label>
          <select
            value={selectedCard1}
            onChange={(e) => {
              const card = e.target.value;
              setSelectedCard1(card);
              if (card === 'new') {
                const newCardName = prompt('Enter new card name:');
                if (newCardName) {
                  setSelectedCard1(newCardName);
                } else {
                  setSelectedCard1('');
                }
              }
            }}
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
            <option value="">-- Select Card --</option>
            {cards.map((card) => (
              <option key={card} value={card}>{card}</option>
            ))}
            <option value="new">+ Add New Card</option>
          </select>
          {selectedCard1 && selectedCard1 !== 'new' && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => openLimitForm(selectedCard1)}
                className="flex-1 text-white text-xs md:text-sm font-semibold py-1.5 md:py-2 px-3 md:px-4 rounded-lg transition-all hover:scale-105 shadow-md"
                style={{ backgroundColor: '#49111c' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a0d15')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#49111c')}
              >
                Set Limit
              </button>
              <button
                onClick={() => openForm(selectedCard1)}
                className="flex-1 text-white text-xs md:text-sm font-semibold py-1.5 md:py-2 px-3 md:px-4 rounded-lg transition-all hover:scale-105 shadow-md"
                style={{ backgroundColor: '#49111c' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a0d15')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#49111c')}
              >
                + Add Entry
              </button>
            </div>
          )}
        </div>

        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md">
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Select Credit Card 2</label>
          <select
            value={selectedCard2}
            onChange={(e) => {
              const card = e.target.value;
              setSelectedCard2(card);
              if (card === 'new') {
                const newCardName = prompt('Enter new card name:');
                if (newCardName) {
                  setSelectedCard2(newCardName);
                } else {
                  setSelectedCard2('');
                }
              }
            }}
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
            <option value="">-- Select Card --</option>
            {cards.map((card) => (
              <option key={card} value={card}>{card}</option>
            ))}
            <option value="new">+ Add New Card</option>
          </select>
          {selectedCard2 && selectedCard2 !== 'new' && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => openLimitForm(selectedCard2)}
                className="flex-1 text-white text-xs md:text-sm font-semibold py-1.5 md:py-2 px-3 md:px-4 rounded-lg transition-all hover:scale-105 shadow-md"
                style={{ backgroundColor: '#49111c' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a0d15')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#49111c')}
              >
                Set Limit
              </button>
              <button
                onClick={() => openForm(selectedCard2)}
                className="flex-1 text-white text-xs md:text-sm font-semibold py-1.5 md:py-2 px-3 md:px-4 rounded-lg transition-all hover:scale-105 shadow-md"
                style={{ backgroundColor: '#49111c' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a0d15')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#49111c')}
              >
                + Add Entry
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Limit Form Section */}
      {showLimitForm && (
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md mb-4 md:mb-6">
          <div className="flex justify-between items-center mb-2 md:mb-3">
            <h2 className="text-base md:text-lg font-semibold text-gray-700">Set Credit Limit - {activeCard}</h2>
            <button
              onClick={() => {
                setShowLimitForm(false);
                setActiveCard('');
              }}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleLimitSubmit} className="flex gap-2 md:gap-3">
            <div className="flex-1">
              <label className="block text-xs md:text-sm font-semibold mb-1 md:mb-2" style={{ color: '#0A0908' }}>Credit Limit</label>
              <input
                type="number"
                step="0.01"
                value={limitFormData.limit}
                onChange={(e) => setLimitFormData({ limit: e.target.value })}
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
                disabled={limitLoading}
                className="text-white text-xs md:text-sm font-semibold py-1.5 md:py-2 px-3 md:px-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50 shadow-md"
                style={{ backgroundColor: '#49111c' }}
                onMouseEnter={(e) => !limitLoading && (e.currentTarget.style.backgroundColor = '#3a0d15')}
                onMouseLeave={(e) => !limitLoading && (e.currentTarget.style.backgroundColor = '#49111c')}
              >
                {limitLoading ? 'Saving...' : 'Update Limit'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transaction Form Section */}
      {showForm && (
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md mb-4 md:mb-6">
          <div className="flex justify-between items-center mb-2 md:mb-3">
            <h2 className="text-base md:text-lg font-semibold text-gray-700">Add Transaction - {activeCard}</h2>
            <button
              onClick={() => {
                setShowForm(false);
                setActiveCard('');
              }}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-3">
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
              <label className="block text-xs md:text-sm font-semibold mb-1 md:mb-2" style={{ color: '#0A0908' }}>Transaction Type</label>
              <select
                value={formData.transactionType}
                onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
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
                <option value="spent">Spent (-)</option>
                <option value="payment">Payment (+)</option>
              </select>
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
                  setActiveCard('');
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white text-xs md:text-sm font-semibold py-1.5 md:py-2 px-3 md:px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Card Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        {selectedCard1 && selectedCard1 !== 'new' && card1Summary && (
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-orange-500">
            <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-2">{selectedCard1}</h3>
            <div className="space-y-1 text-xs md:text-sm">
              <p><span className="text-gray-600">Limit:</span> <span className="font-semibold">₹{limit1.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
              <p><span className="text-gray-600">Total Spent:</span> <span className="font-semibold text-red-600">₹{card1Summary.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
              <p><span className="text-gray-600">Total Paid:</span> <span className="font-semibold text-green-600">₹{card1Summary.totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
              <p><span className="text-gray-600">Current Balance:</span> <span className="font-semibold text-purple-600">₹{card1Summary.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
              <p><span className="text-gray-600">Available Credit:</span> <span className={`font-semibold ${card1Summary.availableCredit >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹{card1Summary.availableCredit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
            </div>
          </div>
        )}
        {selectedCard2 && selectedCard2 !== 'new' && card2Summary && (
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-orange-500">
            <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-2">{selectedCard2}</h3>
            <div className="space-y-1 text-xs md:text-sm">
              <p><span className="text-gray-600">Limit:</span> <span className="font-semibold">₹{limit2.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
              <p><span className="text-gray-600">Total Spent:</span> <span className="font-semibold text-red-600">₹{card2Summary.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
              <p><span className="text-gray-600">Total Paid:</span> <span className="font-semibold text-green-600">₹{card2Summary.totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
              <p><span className="text-gray-600">Current Balance:</span> <span className="font-semibold text-purple-600">₹{card2Summary.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
              <p><span className="text-gray-600">Available Credit:</span> <span className={`font-semibold ${card2Summary.availableCredit >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹{card2Summary.availableCredit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
            </div>
          </div>
        )}
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {selectedCard1 && selectedCard1 !== 'new' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b border-gray-200">
              <h2 className="text-base md:text-lg font-bold" style={{ color: '#0A0908' }}>{selectedCard1}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Date</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Amount</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Note</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {entries1.map((entry) => (
                    <tr key={entry._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm" style={{ color: '#0A0908' }}>
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className={`px-4 md:px-6 py-3 whitespace-nowrap text-sm font-bold ${
                        (entry.amount || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(entry.amount || 0) >= 0 ? '+' : ''}₹{(entry.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 md:px-6 py-3 text-sm" style={{ color: '#0A0908' }}>{entry.note || '-'}</td>
                      <td className="px-4 md:px-6 py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(entry._id, selectedCard1)}
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
                  {entries1.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 md:px-6 py-8 md:py-12 text-center text-sm" style={{ color: '#5e503f' }}>
                        No entries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedCard2 && selectedCard2 !== 'new' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b border-gray-200">
              <h2 className="text-base md:text-lg font-bold" style={{ color: '#0A0908' }}>{selectedCard2}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Date</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Amount</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Note</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: '#5e503f' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {entries2.map((entry) => (
                    <tr key={entry._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm" style={{ color: '#0A0908' }}>
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className={`px-4 md:px-6 py-3 whitespace-nowrap text-sm font-bold ${
                        (entry.amount || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(entry.amount || 0) >= 0 ? '+' : ''}₹{(entry.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 md:px-6 py-3 text-sm" style={{ color: '#0A0908' }}>{entry.note || '-'}</td>
                      <td className="px-4 md:px-6 py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(entry._id, selectedCard2)}
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
                  {entries2.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 md:px-6 py-8 md:py-12 text-center text-sm" style={{ color: '#5e503f' }}>
                        No entries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditCard;
