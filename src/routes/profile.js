const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const AppError = require('../utils/AppError');
const { validateProfileData } = require('../utils/validation');
const User = require('../models/user');

const profileRouter = express.Router();

profileRouter.get('/profile/view', authMiddleware, async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError('Something went wrong'));
    }

    return res.status(200).json({ message: 'User fetched successfully', user });
  } catch (error) {
    console.log('🚀 ~ error:', error);
    return next(new AppError('Something went wrong'));
  }
});

profileRouter.patch(
  '/profile/edit',
  authMiddleware,
  validateProfileData,
  async (req, res, next) => {
    try {
      const updatedUserData = req.body;
      const { _id } = req.user;
      const data = await User.findByIdAndUpdate(_id, updatedUserData, {
        new: true,
        runValidators: true,
      });
      res
        .status(200)
        .json({ message: 'Profile updated successfully', user: data });
    } catch (error) {
      console.log('🚀 ~ error:', error);
      return next(new AppError(error));
    }
  }
);

module.exports = profileRouter;
