const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  note: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Rule', ruleSchema);

