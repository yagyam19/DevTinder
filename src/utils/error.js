const ApiError = require('./ApiError');

class ValidationError extends ApiError {
  constructor(message = 'Validation failed') {
    super(400, message);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized, Please login') {
    super(401, message);
  }
}

class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

module.exports = {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
};
