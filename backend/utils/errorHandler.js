// Common error handler utility
const handleError = (res, error, statusCode = 500) => {
  res.status(statusCode).json({ 
    message: 'Server error', 
    error: error.message 
  });
};

module.exports = { handleError };

