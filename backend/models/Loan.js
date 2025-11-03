const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  bank: {
    type: String,
    required: true
  },
  repaymentDate: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Loan', loanSchema);

