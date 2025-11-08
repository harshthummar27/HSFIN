const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Debit = require('../models/Debit');
const CreditPerson = require('../models/CreditPerson');
const DebitPerson = require('../models/DebitPerson');
const Loan = require('../models/Loan');
const CreditCard = require('../models/CreditCard');
const StockMarket = require('../models/StockMarket');
const Balance = require('../models/Balance');

// Test route to verify dashboard router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Dashboard router is working', timestamp: new Date().toISOString() });
});

// Get dashboard summary
router.get('/summary', auth, async (req, res) => {
  console.log('Dashboard summary route hit');
  const userId = req.user.userId;
  
  try {
    // Calculate total debit (Daily Debit)
    const totalDebit = await Debit.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$rupees' } } }
    ]);
    
    // Calculate total credit (Credit Person)
    const totalCredit = await CreditPerson.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$rupees' } } }
    ]);

    // Calculate total debit person
    const totalDebitPerson = await DebitPerson.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$rupees' } } }
    ]);

    // Calculate total credit person
    const totalCreditPerson = await CreditPerson.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$rupees' } } }
    ]);

    // Calculate loan outstanding
    const loanSummary = await Loan.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$bank', totalOutstanding: { $sum: '$amount' } } }
    ]);

    // Calculate credit card summary
    const creditCardSummary = await CreditCard.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          amount: { $exists: true, $ne: null, $ne: undefined }
        }
      },
      {
        $group: {
          _id: '$cardName',
          totalSpent: {
            $sum: {
              $cond: [{ $lt: ['$amount', 0] }, { $abs: '$amount' }, 0]
            }
          },
          totalPaid: {
            $sum: {
              $cond: [{ $gt: ['$amount', 0] }, '$amount', 0]
            }
          }
        }
      }
    ]);
    
    // Add limit and available credit for each card
    for (let card of creditCardSummary) {
      const limitEntry = await CreditCard.findOne({
        userId: userId,
        cardName: card._id,
        limit: { $exists: true, $ne: null, $ne: undefined }
      }).sort({ createdAt: -1 });
      
      card.limit = limitEntry?.limit || 0;
      card.currentBalance = card.totalSpent - card.totalPaid;
      card.availableCredit = card.limit - card.currentBalance;
    }

    // Calculate Stock Market summary
    const stockMarketInitial = await StockMarket.findOne({
      userId: userId,
      initialBalance: { $exists: true, $ne: null, $ne: undefined }
    }).sort({ createdAt: -1 });

    const stockMarketTransactions = await StockMarket.find({
      userId: userId,
      profitLoss: { $exists: true, $ne: null, $ne: undefined }
    });

    const stockMarketTotal = (stockMarketInitial?.initialBalance || 0) + 
      stockMarketTransactions.reduce((sum, t) => sum + (t.profitLoss || 0), 0);

    // Calculate Balance summary
    const balanceInitial = await Balance.findOne({
      userId: userId,
      $or: [
        { initialCashBalance: { $exists: true, $ne: null } },
        { initialAccountBalance: { $exists: true, $ne: null } }
      ]
    }).sort({ createdAt: -1 });

    const balanceTransactions = await Balance.find({
      userId: userId,
      $or: [
        { cashAmount: { $exists: true, $ne: null } },
        { accountAmount: { $exists: true, $ne: null } }
      ]
    });

    const totalCashTransactions = balanceTransactions.reduce((sum, t) => sum + (t.cashAmount || 0), 0);
    const totalAccountTransactions = balanceTransactions.reduce((sum, t) => sum + (t.accountAmount || 0), 0);
    const balanceTotal = (balanceInitial?.initialCashBalance || 0) + (balanceInitial?.initialAccountBalance || 0) + 
      totalCashTransactions + totalAccountTransactions;

    res.json({
      totalDebit: totalDebit[0]?.total || 0,
      totalCredit: totalCredit[0]?.total || 0,
      totalDebitPerson: totalDebitPerson[0]?.total || 0,
      totalCreditPerson: totalCreditPerson[0]?.total || 0,
      loanSummary,
      creditCardSummary,
      stockMarketTotal: stockMarketTotal || 0,
      balanceTotal: balanceTotal || 0
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

