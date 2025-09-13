const express = require('express');
const {
  authMiddleware,
  comparePassword,
  encryptPassword,
} = require('../middlewares/auth');
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
      return res
        .status(200)
        .json({ message: 'Profile updated successfully', user: data });
    } catch (error) {
      console.log('🚀 ~ error:', error);
      return next(new AppError(error));
    }
  }
);

// do not ever spread the data or doc coming from the mongoose
// as it will just spread the mongoose properties not the actual doc fields.
profileRouter.post(
  '/profile/password',
  authMiddleware,
  comparePassword,
  async (req, res, next) => {
    try {
      const user = req.user;
      const { newPassword } = req.body;
      const encryptedPassword = await encryptPassword(newPassword);
      user.password = encryptedPassword;
      await user.save();
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.log('🚀 ~ error:', error);
      return next(new AppError(error));
    }
  }
);

module.exports = profileRouter;
