const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const AppError = require('../utils/AppError');
const ConnectionRequestModel = require('../models/connectionRequest');
const UserModel = require('../models/user');

const requestRouter = express.Router();

// send connection request
requestRouter.post(
  '/request/send/:status/:toUserId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId, status } = req.params;
      const allowedStatuses = ['interested', 'ignored'];

      const isValidUser = await UserModel.findById(toUserId);
      if (!isValidUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // If there is an existing connection request
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      console.log('🚀 ~ existingConnectionRequest:', existingConnectionRequest);

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: 'Connection request already sent' });
      }

      if (!allowedStatuses.includes(status)) {
        return next(
          new AppError('Please enter a valid status, passed: ' + status)
        );
      }

      const hasIgnored = status === 'ignored';

      const connectionData = {
        fromUserId,
        toUserId,
        status,
      };
      console.log('🚀 ~ connectionData:', connectionData);
      const request = new ConnectionRequestModel(connectionData);
      await request.save();

      return res.status(200).json({
        message: hasIgnored
          ? `${req.user.firstName} ignored ${isValidUser.firstName}`
          : 'Connection request sent successfully.',
      });
    } catch (error) {
      console.log('🚀 ~ error:', error);
      return next(new AppError('Error: ', +error.message));
    }
  }
);

module.exports = requestRouter;
