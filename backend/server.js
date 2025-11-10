const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware - CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in production (adjust as needed)
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!process.env.MONGODB_URI) {
  console.warn('⚠️  WARNING: MONGODB_URI environment variable not set. Using default localhost connection.');
  console.warn('   For production, set MONGODB_URI in your environment variables.');
}

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ MongoDB Connected successfully');
  console.log(`   Database: ${mongoose.connection.name}`);
  console.log(`   Host: ${mongoose.connection.host}`);
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  console.error('   Please check your MONGODB_URI environment variable.');
  console.error('   If using MongoDB Atlas, ensure your IP is whitelisted.');
  // Don't exit in production - let the app continue running
  // process.exit(1);
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'HSfin Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      dashboard: '/api/dashboard',
      debit: '/api/debit',
      loan: '/api/loan',
      creditcard: '/api/creditcard',
      creditPerson: '/api/credit-person',
      debitPerson: '/api/debit-person',
      notes: '/api/notes',
      rules: '/api/rules',
      stockMarket: '/api/stock-market',
      balance: '/api/balance'
    },
    documentation: 'This is the backend API for HSfin Finance Management'
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/debit', require('./routes/debit'));
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
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'OK', 
    message: 'HSfin Backend API is running',
    mongodb: mongoStatus,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

