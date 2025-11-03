const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  // For initial balance entries
  initialCashBalance: {
    type: Number,
    default: null
  },
  initialAccountBalance: {
    type: Number,
    default: null
  },
  // For transaction entries
  cashAmount: {
    type: Number,
    default: null
  },
  accountAmount: {
    type: Number,
    default: null
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  note: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Balance', balanceSchema);

