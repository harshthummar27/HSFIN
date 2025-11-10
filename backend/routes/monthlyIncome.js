const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MonthlyIncome = require('../models/MonthlyIncome');
const { handleError } = require('../utils/errorHandler');

router.get('/', auth, async (req, res) => {
  try {
    const entries = await MonthlyIncome.find({ userId: req.user.userId }).sort({ year: -1, month: -1 });
    res.json(entries);
  } catch (error) {
    handleError(res, error);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { month, year, rupees, note } = req.body;
    const entry = new MonthlyIncome({ userId: req.user.userId, month, year, rupees, note });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    handleError(res, error);
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { month, year, rupees, note } = req.body;
    const entry = await MonthlyIncome.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { month, year, rupees, note },
      { new: true }
    );
    if (!entry) return res.status(404).json({ message: 'Not found' });
    res.json(entry);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await MonthlyIncome.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    if (!entry) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;

