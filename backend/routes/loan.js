const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Loan = require('../models/Loan');

// Get all loans
router.get('/', auth, async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user.userId }).sort({ repaymentDate: 1 });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get distinct banks
router.get('/banks', auth, async (req, res) => {
  try {
    const banks = await Loan.distinct('bank', { userId: req.user.userId });
    res.json(banks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new loan entry
router.post('/', auth, async (req, res) => {
  try {
    const { bank, repaymentDate, amount } = req.body;
    const loan = new Loan({ userId: req.user.userId, bank, repaymentDate, amount });
    await loan.save();
    res.status(201).json({ message: 'Loan entry created successfully', loan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete loan entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const loan = await Loan.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    if (!loan) {
      return res.status(404).json({ message: 'Loan entry not found' });
    }
    res.json({ message: 'Loan entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

