const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { defaultBcryptSalt } = require('../config');
const AppError = require('../utils/AppError');

const authMiddleware = async (req, res, next) => {
  try {
    const { authToken } = req.cookies;
    if (authToken) {
      const encodedObj = await jwt.verify(authToken, process.env.JWT_SECRET);
      console.log('🚀 ~ authMiddleware ~ user:', encodedObj);
      const { id } = encodedObj;
      const user = await User.findById(id);
      if (!user) {
        return next(new AppError('User not found'));
      }
      req.user = user;
      return next();
    }
    return next(new AppError('Invalid request.'));
  } catch (error) {
    console.log('🚀 ~ authMiddleware ~ error:', error);
    return next(new AppError('Invalid request.'));
  }
};

const generateAuthToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

const encryptPassword = async (passwordInputByUser) => {
  const encryptedPassword = await bcrypt.hash(
    passwordInputByUser,
    defaultBcryptSalt
  );

  return encryptedPassword;
};

module.exports = {
  authMiddleware,
  generateAuthToken,
  encryptPassword,
};
