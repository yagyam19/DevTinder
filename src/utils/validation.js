const validator = require('validator');
const AppError = require('../utils/AppError');

const VALID_USER_EDIT_DATA_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'age',
  'gender',
  'imageUrl',
  'about',
  'skills',
];

// const INVALID_EDIT_PROFILE_FIELDS = ['password', 'email'];

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

const validateProfileData = (req, res, next) => {
  const updateUserDetails = req.body;
  const requestDataFields = Object.keys(updateUserDetails);

  const hasValidFields = requestDataFields.every((field) =>
    VALID_USER_EDIT_DATA_FIELDS.includes(field)
  );

  if (!hasValidFields) {
    return next(new AppError('Please send valid data'));
  }

  next();
};

module.exports = { validateSignupData, validateProfileData };
