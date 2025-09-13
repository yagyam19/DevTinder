const validator = require('validator');
const AppError = require('../utils/AppError');

const validateSignupData = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body || {};

  if (!firstName || !lastName) {
    return next(
      new AppError('Please enter a valid first name or last name.', 400)
    );
  }

  if (!validator.isEmail(email)) {
    return next(new AppError('Please check the email', 400));
  }

  if (!validator.isStrongPassword(password)) {
    return next(new AppError('Please enter a strong password', 400));
  }

  next();
};

module.exports = { validateSignupData };
