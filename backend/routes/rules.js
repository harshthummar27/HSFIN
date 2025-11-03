const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Rule = require('../models/Rule');

// Get all rules
router.get('/', auth, async (req, res) => {
  try {
    const rules = await Rule.find().sort({ date: -1 });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new rule
router.post('/', auth, async (req, res) => {
  try {
    const { date, note } = req.body;
    const rule = new Rule({ date, note });
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
    const rule = await Rule.findByIdAndUpdate(
      req.params.id,
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
    const rule = await Rule.findByIdAndDelete(req.params.id);
    if (!rule) {
      return res.status(404).json({ message: 'Rule not found' });
    }
    res.json({ message: 'Rule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

