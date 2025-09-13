const express = require('express');
const { validateSignupData } = require('../utils/validation');
const { encryptPassword } = require('../middlewares/auth');
const AppError = require('../utils/AppError');
const User = require('../models/user');

const authRouter = express.Router();

authRouter.post('/signup', validateSignupData, async (req, res) => {
  // validate the req body data through another middleware
  const securedPassword = await encryptPassword(req.body.password);
  const userObj = {
    ...req.body,
    password: securedPassword,
  };
  console.log('🚀 ~ userObj:', userObj);

  // create a new instance of user model
  try {
    const user = new User(userObj);
    await user.save();
    res.send('Sign up successfull!');
  } catch (error) {
    console.log('🚀 ~ error:', error);
    next(new AppError('Error signing up the user.' + error));
  }
});

// auth using cookies
authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('User not found.'));
    }
    const isPasswordMatched = await user.verifyPassword(password);
    if (!isPasswordMatched) {
      return next(new AppError('Invalid credentials'));
    }

    const authToken = await user.getJWT();

    res.cookie('authToken', authToken, {
      expires: new Date(Date.now() + 1 * 3600000),
    });
    console.log('🚀 ~ authToken:', authToken);
    return res.status(200).json({ message: 'Login successfull', user });
  } catch (error) {
    console.log('🚀 ~ error:', error);
    return next(new AppError('Something went wrong'));
  }
});

authRouter.post('/logout', async (req, res, next) => {
  res.clearCookie('authToken', { path: '/' });
  return res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = authRouter;
