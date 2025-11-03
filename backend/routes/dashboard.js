const express = require('express');
const router = express.Router();
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
  try {
    // Calculate total debit (Daily Debit)
    const totalDebit = await Debit.aggregate([
      { $group: { _id: null, total: { $sum: '$rupees' } } }
    ]);
    
    // Calculate total credit (Credit Person)
    const totalCredit = await CreditPerson.aggregate([
      { $group: { _id: null, total: { $sum: '$rupees' } } }
    ]);

    // Calculate total debit person
    const totalDebitPerson = await DebitPerson.aggregate([
      { $group: { _id: null, total: { $sum: '$rupees' } } }
    ]);

    // Calculate total credit person
    const totalCreditPerson = await CreditPerson.aggregate([
      { $group: { _id: null, total: { $sum: '$rupees' } } }
    ]);

    // Calculate loan outstanding
    const loanSummary = await Loan.aggregate([
      { $group: { _id: '$bank', totalOutstanding: { $sum: '$amount' } } }
    ]);

    // Calculate credit card summary
    const creditCardSummary = await CreditCard.aggregate([
      {
        $match: {
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
        cardName: card._id,
        limit: { $exists: true, $ne: null, $ne: undefined }
      }).sort({ createdAt: -1 });
      
      card.limit = limitEntry?.limit || 0;
      card.currentBalance = card.totalSpent - card.totalPaid;
      card.availableCredit = card.limit - card.currentBalance;
    }

    // Calculate Stock Market summary
    const stockMarketInitial = await StockMarket.findOne({
      initialBalance: { $exists: true, $ne: null, $ne: undefined }
    }).sort({ createdAt: -1 });

    const stockMarketTransactions = await StockMarket.find({
      profitLoss: { $exists: true, $ne: null, $ne: undefined }
    });

    const stockMarketTotal = (stockMarketInitial?.initialBalance || 0) + 
      stockMarketTransactions.reduce((sum, t) => sum + (t.profitLoss || 0), 0);

    // Calculate Balance summary
    const balanceInitial = await Balance.findOne({
      $or: [
        { initialCashBalance: { $exists: true, $ne: null } },
        { initialAccountBalance: { $exists: true, $ne: null } }
      ]
    }).sort({ createdAt: -1 });

    const balanceTransactions = await Balance.find({
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

