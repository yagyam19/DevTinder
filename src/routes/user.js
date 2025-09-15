const express = require('express');
const User = require('../models/user');
const AppError = require('../utils/AppError');
const { authMiddleware } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const UserModel = require('../models/user');
const userRouter = express.Router();

const USER_SAFE_DATA = [
  'firstName',
  'lastName',
  'age',
  'about',
  'gender',
  'imageUrl',
];

// requests api - get all the pending connection requests for the user
userRouter.get('/user/requests', authMiddleware, async (req, res, next) => {
  try {
    const loggedInUser = req.user._id;
    const requestsData = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', USER_SAFE_DATA);

    console.log('🚀 ~ requestsData:', requestsData);
    return res.status(200).json({
      message: 'Data fetched successfully!',
      requests: requestsData,
    });
  } catch (error) {
    console.log('🚀 ~ error:', error);
    return next(new AppError(error));
  }
});

// get all connections or matches
userRouter.get('/user/connections', authMiddleware, async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const connectionsRawData = await ConnectionRequestModel.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      status: 'accepted',
    })
      .populate('fromUserId', USER_SAFE_DATA)
      .populate('toUserId', USER_SAFE_DATA);

    const connections = connectionsRawData.map((data) => {
      if (data.fromUserId._id.equals(loggedInUser._id)) {
        return data.toUserId;
      }
      return data.fromUserId;
    });

    return res.status(200).json({
      message: 'Connections fetched successfully',
      connections,
    });
  } catch (error) {
    console.log('🚀 ~ error:', error);
    return next(new AppError('Something went wrong'));
  }
});

// Feed api - get all the users from db
userRouter.get('/user/feed', authMiddleware, async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 100 ? 50 : limit;
    const skip = (page - 1) * limit;

    const allConnections = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select(['fromUserId', 'toUserId']);

    const excludedIds = new Set(
      allConnections.flatMap(({ fromUserId, toUserId }) => [
        fromUserId.toString(),
        toUserId.toString(),
      ])
    );

    excludedIds.add(loggedInUser._id.toString());

    // find all the interested user id from the connection request model and all
    // the new users who arent connected with loggedin user

    const feedQuery = {
      $or: [
        { _id: { $nin: Array.from(excludedIds) } },
        {
          _id: {
            $in: await ConnectionRequestModel.find({
              toUserId: loggedInUser._id,
              status: 'interested',
            }).distinct('fromUserId'),
          },
        },
      ],
    };

    const feedUsers = await UserModel.find(feedQuery).skip(skip).limit(limit);
    const totalUsers = await UserModel.countDocuments(feedQuery);

    return res.status(200).json({
      users: feedUsers,
      message: 'Users fetched successfully!',
      page,
      limit,
      count: totalUsers,
    });
  } catch (error) {
    console.log('🚀 ~ error:', error);
    return next(
      new AppError({ message: 'Error in getting the users ' + error })
    );
  }
});

module.exports = userRouter;
