const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const StockMarket = require('../models/StockMarket');

// Get all stock market entries (exclude balance entries)
router.get('/', auth, async (req, res) => {
  try {
    // Get only profit/loss entries (exclude balance entries)
    const entries = await StockMarket.find({ 
      profitLoss: { $exists: true, $ne: null, $ne: undefined } 
    }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get initial balance (latest one)
router.get('/balance', auth, async (req, res) => {
  try {
    const balance = await StockMarket.findOne({ 
      initialBalance: { $exists: true, $ne: null, $ne: undefined } 
    }).sort({ createdAt: -1 });
    res.json({ initialBalance: balance?.initialBalance || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new stock market entry (profit/loss only)
router.post('/', auth, async (req, res) => {
  try {
    const { date, profitLoss, note } = req.body;
    
    if (!profitLoss && profitLoss !== 0) {
      return res.status(400).json({ message: 'Profit/Loss is required' });
    }
    
    const entry = new StockMarket({ 
      date, 
      profitLoss: parseFloat(profitLoss), 
      note: note || '' 
    });
    await entry.save();
    
    res.status(201).json({ message: 'Stock market entry created successfully', entry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update initial balance
router.put('/balance', auth, async (req, res) => {
  try {
    const { initialBalance } = req.body;
    
    if (initialBalance === undefined || initialBalance === null || initialBalance === '') {
      return res.status(400).json({ message: 'Initial balance is required' });
    }
    
    // Find and update existing balance entry, or create new one
    const balance = await StockMarket.findOneAndUpdate(
      { initialBalance: { $exists: true, $ne: null, $ne: undefined } },
      { 
        initialBalance: parseFloat(initialBalance), 
        date: new Date(), 
        note: 'Initial Balance',
        profitLoss: null // Ensure profitLoss is not set for balance entries
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    
    res.json({ message: 'Balance updated successfully', balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update stock market entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { date, profitLoss, note } = req.body;
    const entry = await StockMarket.findByIdAndUpdate(
      req.params.id,
      { date, profitLoss: parseFloat(profitLoss), note },
      { new: true }
    );
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json({ message: 'Entry updated successfully', entry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete stock market entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await StockMarket.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

