const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Rule = require('../models/Rule');

// Get all rules
router.get('/', auth, async (req, res) => {
  try {
    const rules = await Rule.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new rule
router.post('/', auth, async (req, res) => {
  try {
    const { date, note } = req.body;
    const rule = new Rule({ userId: req.user.userId, date, note });
    await rule.save();
    res.status(201).json({ message: 'Rule created successfully', rule });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update rule
router.put('/:id', auth, async (req, res) => {
  try {
    const { date, note } = req.body;
    const rule = await Rule.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { date, note },
      { new: true }
    );
    if (!rule) {
      return res.status(404).json({ message: 'Rule not found' });
    }
    res.json({ message: 'Rule updated successfully', rule });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete rule
router.delete('/:id', auth, async (req, res) => {
  try {
    const rule = await Rule.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    if (!rule) {
      return res.status(404).json({ message: 'Rule not found' });
    }
    res.json({ message: 'Rule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

