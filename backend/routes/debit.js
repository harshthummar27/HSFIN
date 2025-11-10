const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Debit = require('../models/Debit');

// Get all debit entries
router.get('/', auth, async (req, res) => {
  try {
    const debits = await Debit.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(debits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new debit entry
router.post('/', auth, async (req, res) => {
  try {
    const { date, rupees, note } = req.body;
    const debit = new Debit({ userId: req.user.userId, date, rupees, note });
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
    const debit = await Debit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
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
    const debit = await Debit.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    if (!debit) {
      return res.status(404).json({ message: 'Debit entry not found' });
    }
    res.json({ message: 'Debit entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

