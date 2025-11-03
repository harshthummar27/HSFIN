const mongoose = require('mongoose');

const debitPersonSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  rupees: {
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

module.exports = mongoose.model('DebitPerson', debitPersonSchema);

