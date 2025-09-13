const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const AppError = require('../utils/AppError');

const requestRouter = express.Router();

// send connection request
requestRouter.post(
  '/request/send/interested/:userId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const user = req.user;
      console.log('sending connection request', user);
      res
        .status(200)
        .send(
          `${user.firstName} ${user.lastName} has sent you connection request.`
        );
    } catch (error) {
      console.log('🚀 ~ error:', error);
      return next(new AppError('Something went wrong'));
    }
  }
);

module.exports = requestRouter;
