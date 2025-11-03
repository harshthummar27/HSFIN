const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization') || req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token with JWT_SECRET
    const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(401).json({ message: 'Token is not valid', error: error.message });
  }
};

module.exports = auth;

