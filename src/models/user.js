const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 25,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: [18, 'minimum age must be 18'],
    },
    gender: {
      type: String,
      required: true,
      enum: {
        values: ['male', 'female', 'others'],
        message: 'must be a valid gender',
      },
    },
    imageUrl: {
      type: String,
      default: '',
      required: false,
    },
    about: {
      type: String,
      default: '',
      required: false,
    },
  },
  { timestamps: true }
);

// const User = mongoose.model('User', userSchema);

module.exports = mongoose.model('User', userSchema);
