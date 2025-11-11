const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MonthlyDebit = require('../models/MonthlyDebit');

// Get all monthly debit entries
router.get('/', auth, async (req, res) => {
  try {
    const monthlyDebits = await MonthlyDebit.find({ userId: req.user.userId }).sort({ year: -1, month: -1 });
    res.json(monthlyDebits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new monthly debit entry
router.post('/', auth, async (req, res) => {
  try {
    const { month, year, rupees, note } = req.body;
    const monthlyDebit = new MonthlyDebit({ userId: req.user.userId, month, year, rupees, note });
    await monthlyDebit.save();
    res.status(201).json({ message: 'Monthly debit entry created successfully', monthlyDebit });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update monthly debit entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { month, year, rupees, note } = req.body;
    const monthlyDebit = await MonthlyDebit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { month, year, rupees, note },
      { new: true }
    );
    if (!monthlyDebit) {
      return res.status(404).json({ message: 'Monthly debit entry not found' });
    }
    res.json({ message: 'Monthly debit entry updated successfully', monthlyDebit });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete monthly debit entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const monthlyDebit = await MonthlyDebit.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    if (!monthlyDebit) {
      return res.status(404).json({ message: 'Monthly debit entry not found' });
    }
    res.json({ message: 'Monthly debit entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

