const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hsfin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

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
  res.json({ status: 'OK', message: 'HSfin Backend API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

