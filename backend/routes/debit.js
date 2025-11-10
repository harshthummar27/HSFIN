const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Debit = require('../models/Debit');
const { handleError } = require('../utils/errorHandler');

router.get('/', auth, async (req, res) => {
  try {
    const debits = await Debit.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(debits);
  } catch (error) {
    handleError(res, error);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { date, rupees, note } = req.body;
    const debit = new Debit({ userId: req.user.userId, date, rupees, note });
    await debit.save();
    res.status(201).json(debit);
  } catch (error) {
    handleError(res, error);
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { date, rupees, note } = req.body;
    const debit = await Debit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { date, rupees, note },
      { new: true }
    );
    if (!debit) return res.status(404).json({ message: 'Not found' });
    res.json(debit);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const debit = await Debit.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    if (!debit) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;

