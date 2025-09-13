// utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // call parent constructor (Error)
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // distinguish from programming errors

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
