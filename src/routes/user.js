const express = require('express');
const User = require('../models/user');
const AppError = require('../utils/AppError');

const userRouter = express.Router();

// Feed api - get all the users from db
userRouter.get('/user/feed', async (req, res, next) => {
  try {
    const users = await User.find({});
    res
      .status(200)
      .send({ users: users, message: 'Users fetched successfully!' });
  } catch (error) {
    console.log('🚀 ~ error:', error);
    next(new AppError({ message: 'Error in getting the users ' + error }));
  }
});

module.exports = userRouter;
