const mongoose = require('mongoose');
const validator = require('validator');
const { Schema } = mongoose;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Please enter a valid email: ' + value);
        }
      },
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
      // validate(value) {
      //   if (!validator.isURL(value)) {
      //     throw new Error('Please enter a valid image url: ', value);
      //   }
      // },
    },
    about: {
      type: String,
      default: '',
      required: false,
    },
    skills: {
      type: [String],
      maxlength: 2,
    },
  },
  { timestamps: true }
);

// const User = mongoose.model('User', userSchema);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return token;
};

userSchema.methods.verifyPassword = async function (passwordInputByUser) {
  const hasedPassword = this.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    hasedPassword
  );
  return isPasswordValid;
};

module.exports = mongoose.model('User', userSchema);
