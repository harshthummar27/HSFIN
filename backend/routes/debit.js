const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Debit = require('../models/Debit');

// Get all debit entries
router.get('/', auth, async (req, res) => {
  try {
    const debits = await Debit.find().sort({ date: -1 });
    res.json(debits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new debit entry
router.post('/', auth, async (req, res) => {
  try {
    const { date, rupees, note } = req.body;
    const debit = new Debit({ date, rupees, note });
    await debit.save();
    res.status(201).json({ message: 'Debit entry created successfully', debit });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update debit entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { date, rupees, note } = req.body;
    const debit = await Debit.findByIdAndUpdate(
      req.params.id,
      { date, rupees, note },
      { new: true }
    );
    if (!debit) {
      return res.status(404).json({ message: 'Debit entry not found' });
    }
    res.json({ message: 'Debit entry updated successfully', debit });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete debit entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const debit = await Debit.findByIdAndDelete(req.params.id);
    if (!debit) {
      return res.status(404).json({ message: 'Debit entry not found' });
    }
    res.json({ message: 'Debit entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Bulk create monthly debit entries
router.post('/bulk', auth, async (req, res) => {
  try {
    const { month, year, amount, note } = req.body;
    
    if (!month || !year || !amount) {
      return res.status(400).json({ message: 'Month, year, and amount are required' });
    }

    // Get number of days in the month
    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyAmount = parseFloat(amount) / daysInMonth;

    // Create entries for each day of the month
    const entries = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      entries.push({
        date: date.toISOString().split('T')[0],
        rupees: parseFloat(dailyAmount.toFixed(2)),
        note: note || `Daily debit - ${new Date(year, month - 1, day).toLocaleDateString('en-IN', { month: 'long', day: 'numeric' })}`
      });
    }

    // Insert all entries
    const createdDebits = await Debit.insertMany(entries);
    res.status(201).json({ 
      message: `Created ${createdDebits.length} debit entries for ${new Date(year, month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`,
      count: createdDebits.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete all debit entries
router.delete('/all', auth, async (req, res) => {
  try {
    const result = await Debit.deleteMany({});
    res.json({ 
      message: 'All debit entries deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

