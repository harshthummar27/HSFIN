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

// Get dashboard summary
router.get('/summary', auth, async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.userId);
  
  try {
    // Execute all queries in parallel for better performance
    const [
      totalDebit,
      totalCredit,
      totalDebitPerson,
      totalCreditPerson,
      loanSummary,
      creditCardSummary,
      stockMarketInitial,
      stockMarketTransactions,
      balanceInitial,
      balanceTransactions
    ] = await Promise.all([
      Debit.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: '$rupees' } } }
      ]),
      CreditPerson.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: '$rupees' } } }
      ]),
      DebitPerson.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: '$rupees' } } }
      ]),
      CreditPerson.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: '$rupees' } } }
      ]),
      Loan.aggregate([
        { $match: { userId } },
        { $group: { _id: '$bank', totalOutstanding: { $sum: '$amount' } } }
      ]),
      CreditCard.aggregate([
        {
          $match: {
            userId,
            amount: { $exists: true, $ne: null }
          }
        },
        {
          $group: {
            _id: '$cardName',
            totalSpent: {
              $sum: { $cond: [{ $lt: ['$amount', 0] }, { $abs: '$amount' }, 0] }
            },
            totalPaid: {
              $sum: { $cond: [{ $gt: ['$amount', 0] }, '$amount', 0] }
            }
          }
        }
      ]),
      StockMarket.findOne({
        userId: req.user.userId,
        initialBalance: { $exists: true, $ne: null }
      }).sort({ createdAt: -1 }),
      StockMarket.find({
        userId: req.user.userId,
        profitLoss: { $exists: true, $ne: null }
      }),
      Balance.findOne({
        userId: req.user.userId,
        $or: [
          { initialCashBalance: { $exists: true, $ne: null } },
          { initialAccountBalance: { $exists: true, $ne: null } }
        ]
      }).sort({ createdAt: -1 }),
      Balance.find({
        userId: req.user.userId,
        $or: [
          { cashAmount: { $exists: true, $ne: null } },
          { accountAmount: { $exists: true, $ne: null } }
        ]
      })
    ]);

    // Process credit card limits
    const cardNames = creditCardSummary.map(c => c._id);
    const cardLimits = await Promise.all(
      cardNames.map(cardName =>
        CreditCard.findOne({
          userId: req.user.userId,
          cardName,
          limit: { $exists: true, $ne: null }
        }).sort({ createdAt: -1 }).select('limit')
      )
    );

    creditCardSummary.forEach((card, index) => {
      card.limit = cardLimits[index]?.limit || 0;
      card.currentBalance = card.totalSpent - card.totalPaid;
      card.availableCredit = card.limit - card.currentBalance;
    });

    const stockMarketTotal = (stockMarketInitial?.initialBalance || 0) + 
      stockMarketTransactions.reduce((sum, t) => sum + (t.profitLoss || 0), 0);

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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

