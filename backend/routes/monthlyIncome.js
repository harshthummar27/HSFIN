const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MonthlyIncome = require('../models/MonthlyIncome');

// Get all monthly income entries
router.get('/', auth, async (req, res) => {
  try {
    const monthlyIncomes = await MonthlyIncome.find({ userId: req.user.userId }).sort({ year: -1, month: -1 });
    res.json(monthlyIncomes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new monthly income entry
router.post('/', auth, async (req, res) => {
  try {
    const { month, year, rupees, note } = req.body;
    const monthlyIncome = new MonthlyIncome({ userId: req.user.userId, month, year, rupees, note });
    await monthlyIncome.save();
    res.status(201).json({ message: 'Monthly income entry created successfully', monthlyIncome });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update monthly income entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { month, year, rupees, note } = req.body;
    const monthlyIncome = await MonthlyIncome.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { month, year, rupees, note },
      { new: true }
    );
    if (!monthlyIncome) {
      return res.status(404).json({ message: 'Monthly income entry not found' });
    }
    res.json({ message: 'Monthly income entry updated successfully', monthlyIncome });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete monthly income entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const monthlyIncome = await MonthlyIncome.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    if (!monthlyIncome) {
      return res.status(404).json({ message: 'Monthly income entry not found' });
    }
    res.json({ message: 'Monthly income entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

