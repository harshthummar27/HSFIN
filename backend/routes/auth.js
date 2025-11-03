const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Fixed credentials (in production, these should be in environment variables)
const FIXED_EMAIL = process.env.EMAIL || 'harsh.hsfin@self.com';
const FIXED_PASSWORD = process.env.PASSWORD || 'adminhsfin8412';

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate credentials
    if (email !== FIXED_EMAIL || password !== FIXED_PASSWORD) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token with consistent JWT_SECRET
    const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';
    const token = jwt.sign(
      { email: FIXED_EMAIL },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: { email: FIXED_EMAIL }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify token endpoint
router.get('/verify', require('../middleware/auth'), (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;

