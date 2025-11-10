require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware - CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('⚠️  WARNING: MONGODB_URI not set');
}

mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/hsfin')
  .then(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ MongoDB Connected');
    }
  })
  .catch(err => {
    console.error('❌ MongoDB Error:', err.message);
  });

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'HSfin Backend API', status: 'running' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/debit', require('./routes/debit'));
app.use('/api/monthly-debit', require('./routes/monthlyDebit'));
app.use('/api/monthly-income', require('./routes/monthlyIncome'));
app.use('/api/loan', require('./routes/loan'));
app.use('/api/creditcard', require('./routes/creditcard'));
app.use('/api/credit-person', require('./routes/creditPerson'));
app.use('/api/debit-person', require('./routes/debitPerson'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/rules', require('./routes/rules'));
app.use('/api/stock-market', require('./routes/stockMarket'));
app.use('/api/balance', require('./routes/balance'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server running on port ${PORT}`);
  }
});

