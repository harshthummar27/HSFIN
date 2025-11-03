const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CreditCard = require('../models/CreditCard');

// Get all credit card transactions (exclude limit entries)
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await CreditCard.find({
      amount: { $exists: true, $ne: null, $ne: undefined }
    }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get distinct card names
router.get('/cards', auth, async (req, res) => {
  try {
    const cards = await CreditCard.distinct('cardName');
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get card limit
router.get('/limit/:cardName', auth, async (req, res) => {
  try {
    const limit = await CreditCard.findOne({
      cardName: req.params.cardName,
      limit: { $exists: true, $ne: null, $ne: undefined }
    }).sort({ createdAt: -1 });
    res.json({ limit: limit?.limit || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get transactions by card name
router.get('/card/:cardName', auth, async (req, res) => {
  try {
    const transactions = await CreditCard.find({
      cardName: req.params.cardName,
      amount: { $exists: true, $ne: null, $ne: undefined }
    }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update card limit
router.put('/limit/:cardName', auth, async (req, res) => {
  try {
    const { limit } = req.body;
    
    if (limit === undefined || limit === null || limit === '') {
      return res.status(400).json({ message: 'Limit is required' });
    }
    
    const limitEntry = await CreditCard.findOneAndUpdate(
      { cardName: req.params.cardName, limit: { $exists: true, $ne: null, $ne: undefined } },
      { 
        cardName: req.params.cardName,
        limit: parseFloat(limit),
        date: new Date(),
        note: 'Credit Limit',
        amount: null
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    
    res.json({ message: 'Credit limit updated successfully', limitEntry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new transaction entry (spend/payment)
router.post('/', auth, async (req, res) => {
  try {
    const { cardName, date, amount, note } = req.body;
    
    if (!amount && amount !== 0) {
      return res.status(400).json({ message: 'Amount is required' });
    }
    
    // For spend entries, amount should be negative (or we'll make it negative)
    // For payment entries, amount should be positive
    // User enters positive for spend, we'll store as negative
    const transaction = new CreditCard({
      cardName,
      date: date ? new Date(date) : new Date(),
      amount: parseFloat(amount), // Store as entered (positive for payment, negative for spend)
      note: note || ''
    });
    await transaction.save();
    
    res.status(201).json({ message: 'Transaction added successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update transaction entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { date, amount, note } = req.body;
    const entry = await CreditCard.findByIdAndUpdate(
      req.params.id,
      { date, amount: parseFloat(amount), note },
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

// Delete entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await CreditCard.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

