const { Schema, default: mongoose, model } = require('mongoose');
const AppError = require('../utils/AppError');

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      enum: {
        values: ['interested', 'ignored', 'accepted', 'rejected'],
        message: `{VALUE} is an incorrect status type`,
      },
      required: true,
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre('save', function (next) {
  const { fromUserId, toUserId } = this;
  if (fromUserId.equals(toUserId)) {
    throw new Error('Invalid request');
  }
  next();
});

const ConnectionRequestModel = model(
  'ConnectionRequest',
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
