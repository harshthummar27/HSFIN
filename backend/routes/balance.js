const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Balance = require('../models/Balance');

// Get initial balances
router.get('/initial', auth, async (req, res) => {
  try {
    const balance = await Balance.findOne({
      $or: [
        { initialCashBalance: { $exists: true, $ne: null } },
        { initialAccountBalance: { $exists: true, $ne: null } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json({
      initialCashBalance: balance?.initialCashBalance || 0,
      initialAccountBalance: balance?.initialAccountBalance || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all transactions (exclude initial balance entries)
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Balance.find({
      $or: [
        { cashAmount: { $exists: true, $ne: null } },
        { accountAmount: { $exists: true, $ne: null } }
      ]
    }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update initial balances
router.put('/initial', auth, async (req, res) => {
  try {
    const { initialCashBalance, initialAccountBalance } = req.body;
    
    if (initialCashBalance === undefined && initialAccountBalance === undefined) {
      return res.status(400).json({ message: 'At least one balance is required' });
    }
    
    const balanceData = {
      date: new Date(),
      note: 'Initial Balance'
    };
    
    if (initialCashBalance !== undefined && initialCashBalance !== null && initialCashBalance !== '') {
      balanceData.initialCashBalance = parseFloat(initialCashBalance);
    }
    
    if (initialAccountBalance !== undefined && initialAccountBalance !== null && initialAccountBalance !== '') {
      balanceData.initialAccountBalance = parseFloat(initialAccountBalance);
    }
    
    // Find and update existing initial balance, or create new
    const balance = await Balance.findOneAndUpdate(
      {
        $or: [
          { initialCashBalance: { $exists: true, $ne: null } },
          { initialAccountBalance: { $exists: true, $ne: null } }
        ]
      },
      balanceData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    
    res.json({ message: 'Initial balance updated successfully', balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new transaction entry
router.post('/', auth, async (req, res) => {
  try {
    const { date, cashAmount, accountAmount, note } = req.body;
    
    if ((!cashAmount || cashAmount === '') && (!accountAmount || accountAmount === '')) {
      return res.status(400).json({ message: 'At least one amount is required' });
    }
    
    const transactionData = {
      date: date ? new Date(date) : new Date(),
      note: note || ''
    };
    
    if (cashAmount !== undefined && cashAmount !== null && cashAmount !== '') {
      transactionData.cashAmount = parseFloat(cashAmount);
    }
    
    if (accountAmount !== undefined && accountAmount !== null && accountAmount !== '') {
      transactionData.accountAmount = parseFloat(accountAmount);
    }
    
    const transaction = new Balance(transactionData);
    await transaction.save();
    
    res.status(201).json({ message: 'Transaction added successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete transaction entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await Balance.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

