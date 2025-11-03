const mongoose = require('mongoose');

const creditCardSchema = new mongoose.Schema({
  cardName: {
    type: String,
    required: true
  },
  // For limit entries
  limit: {
    type: Number,
    default: null
  },
  // For transaction entries
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  amount: {
    type: Number,
    default: null
  },
  note: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CreditCard', creditCardSchema);

