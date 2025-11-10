const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CreditPerson = require('../models/CreditPerson');

// Get all credit person entries
router.get('/', auth, async (req, res) => {
  try {
    const entries = await CreditPerson.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new credit person entry
router.post('/', auth, async (req, res) => {
  try {
    const { date, rupees, note } = req.body;
    const entry = new CreditPerson({ userId: req.user.userId, date, rupees, note });
    await entry.save();
    res.status(201).json({ message: 'Credit person entry created successfully', entry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update credit person entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { date, rupees, note } = req.body;
    const entry = await CreditPerson.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { date, rupees, note },
      { new: true }
    );
    if (!entry) {
      return res.status(404).json({ message: 'Credit person entry not found' });
    }
    res.json({ message: 'Credit person entry updated successfully', entry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete credit person entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await CreditPerson.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    if (!entry) {
      return res.status(404).json({ message: 'Credit person entry not found' });
    }
    res.json({ message: 'Credit person entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

