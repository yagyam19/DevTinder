const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error caught by middleware:', err);

  // Default values
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    status: err.status || 'error',
    message,
  });
};

module.exports = errorHandler;
