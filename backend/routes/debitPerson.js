const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const DebitPerson = require('../models/DebitPerson');

// Get all debit person entries
router.get('/', auth, async (req, res) => {
  try {
    const entries = await DebitPerson.find().sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new debit person entry
router.post('/', auth, async (req, res) => {
  try {
    const { date, rupees, note } = req.body;
    const entry = new DebitPerson({ date, rupees, note });
    await entry.save();
    res.status(201).json({ message: 'Debit person entry created successfully', entry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update debit person entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { date, rupees, note } = req.body;
    const entry = await DebitPerson.findByIdAndUpdate(
      req.params.id,
      { date, rupees, note },
      { new: true }
    );
    if (!entry) {
      return res.status(404).json({ message: 'Debit person entry not found' });
    }
    res.json({ message: 'Debit person entry updated successfully', entry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete debit person entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await DebitPerson.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Debit person entry not found' });
    }
    res.json({ message: 'Debit person entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

