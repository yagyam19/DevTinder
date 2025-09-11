class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this);
  }
}

module.exports = ApiError;
