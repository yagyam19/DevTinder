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
          : `${req.user.firstName} has sent request to ${isValidUser.firstName}`,
      });
    } catch (error) {
      console.log('🚀 ~ error:', error);
      return next(new AppError('Error: ', +error.message));
    }
  }
);

requestRouter.post(
  '/request/review/:status/:requestId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatuses = ['accepted', 'rejected'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Please send a valid status' });
      }

      // request id should be valid
      // validate the status
      // request id is valid or it can accept the connection request or not.
      // accept connection request logic
      // the status should be interested then only we need to do all the stuff
      // toUser must be login user ( if Yagyam has sent request to dhoni then dhoni should be the one who accepts it not yagyam)

      const isValidRequestId = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser?._id,
        status: 'interested',
      });
      if (!isValidRequestId) {
        return res
          .status(400)
          .json({ message: 'Connection request not found' });
      }

      const updatedData = await ConnectionRequestModel.findByIdAndUpdate(
        requestId,
        { status },
        { runValidators: true, new: true }
      );

      return res.status(200).json({
        message: 'Connection Request accepted successfully',
        data: updatedData,
      });
    } catch (error) {
      console.log('🚀 ~ error:', error);
      return next(new AppError(error));
    }
  }
);

module.exports = requestRouter;
