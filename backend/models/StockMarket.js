const mongoose = require('mongoose');

const stockMarketSchema = new mongoose.Schema({
  initialBalance: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  profitLoss: {
    type: Number,
    required: true
  },
  note: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StockMarket', stockMarketSchema);

