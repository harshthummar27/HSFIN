const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  let token = null;
  const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';
  
  try {
    // Get token from Authorization header
    const authHeader = req.get('Authorization') || 
                       req.header('Authorization') || 
                       req.headers.authorization || 
                       req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Extract token from "Bearer <token>" format
    // Handle cases like "Bearer Bearer <token>", quotes, or extra whitespace
    let rawToken = authHeader.trim();
    
    // Remove all "Bearer " prefixes (case-insensitive) - handle double "Bearer Bearer"
    while (rawToken.toLowerCase().startsWith('bearer ')) {
      rawToken = rawToken.substring(7).trim();
    }
    
    // Remove quotes if present (from localStorage JSON.stringify issues)
    if ((rawToken.startsWith('"') && rawToken.endsWith('"')) || 
        (rawToken.startsWith("'") && rawToken.endsWith("'"))) {
      rawToken = rawToken.slice(1, -1).trim();
    }
    
    token = rawToken;
    
    if (!token || token.length === 0) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Validate token format - JWT tokens have 3 parts separated by dots
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return res.status(401).json({ 
        message: 'Invalid token format',
        hint: 'Token should be a valid JWT with 3 parts separated by dots'
      });
    }

    // Verify token with JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      const hint = error.message === 'invalid signature' 
        ? 'Token was signed with a different JWT_SECRET. Please login again to get a new token from this server.'
        : 'Make sure you are sending the token in the Authorization header as: Bearer <your-token>';
      
      return res.status(401).json({ 
        message: 'Invalid token',
        details: error.message,
        hint: hint
      });
    }
    return res.status(401).json({ message: 'Token is not valid', error: error.message });
  }
};

module.exports = auth;

