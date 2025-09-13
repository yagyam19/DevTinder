const express = require('express');
require('dotenv').config();
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const errorHandler = require('./middlewares/error');
const cookieParser = require('cookie-parser');
const { authMiddleware, encryptPassword } = require('./middlewares/auth');
const { validateSignupData } = require('./utils/validation');
const AppError = require('./utils/AppError');

app.use(express.json());
app.use(cookieParser());

app.post('/signup', validateSignupData, async (req, res) => {
  // validate the req body data through another middleware

  const securedPassword = await encryptPassword(req.body.password);
  const userObj = {
    ...req.body,
    password: securedPassword,
  };
  console.log('🚀 ~ userObj:', userObj);

  // create a new instance of user model
  try {
    const user = new User(userObj);
    await user.save();
    res.send('Sign up successfull!');
  } catch (error) {
    console.log('🚀 ~ error:', error);
    next(new AppError('Error signing up the user.' + error));
  }
});

// auth using cookies
app.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('User not found.'));
    }
    const isPasswordMatched = await user.verifyPassword(password);
    if (!isPasswordMatched) {
      return next(new AppError('Invalid credentials'));
    }

    const authToken = await user.getJWT();

    res.cookie('authToken', authToken, {
      expires: new Date(Date.now() + 1 * 3600000),
    });
    console.log('🚀 ~ authToken:', authToken);
    return res.status(200).json({ message: 'Login successfull', user });
  } catch (error) {
    console.log('🚀 ~ error:', error);
    return next(new AppError('Something went wrong'));
  }
});

app.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError('Something went wrong'));
    }

    return res.status(200).json({ message: 'User fetched successfully', user });
  } catch (error) {
    console.log('🚀 ~ error:', error);
  }
});

// send connection request
app.post('/connection-request', authMiddleware, async (req, res, next) => {
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
});

// Feed api - get all the users from db
app.get('/users', async (req, res, next) => {
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

app.put('/update/user', async (req, res, next) => {
  try {
    const { userId, ...rest } = req.body;
    const allowedUpdates = ['gender', 'userId', 'skills', 'age', 'imageUrl'];

    const isUpdateAllowed = Object.keys(rest).every((key) =>
      allowedUpdates.includes(key)
    );
    if (!isUpdateAllowed) {
      next(new AppError('Please send a valid data'));
    }

    const updatedUser = await User.findByIdAndUpdate(userId, rest, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      next(new AppError({ message: 'User not found.' }));
    }
    res.status(200).send({ message: 'User updated successfully.' });
  } catch (error) {
    console.log('🚀 ~ error:', error);
    next(new AppError({ message: 'Error in updating the user ' + error }));
  }
});

// DELETE /delete/user/123
app.delete('/delete/user', async (req, res, next) => {
  try {
    console.log('🚀 ~ req.query:', req);
    const { userId } = req.query;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      next(new AppError('User not found.'));
    }
    res.status(200).send('User deleted successfully');
  } catch (error) {
    next(new AppError('Something went wrong'));
  }
});

// app.get('/login', async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//       return next(new AppError('User not found'));
//     }
//     const isPasswordMatched = await bcrypt.compare(password, user?.password);
//     if (!isPasswordMatched) {
//       return next(new AppError('Invalid credentials.'));
//     }

//     const accessToken = generateAuthToken(user);
//     res
//       .status(200)
//       .json({ message: 'Logged in successfully', user, token: accessToken });
//   } catch (error) {
//     console.log('🚀 ~ error:', error);
//     next(new AppError('Invalid credentials.'));
//   }
// });

// app.get('/profile', async (req, res, next) => {
//   try {
//     console.log('req.userId', req.userId);
//     const user = await User.findById(req.userId);
//     if (!user) {
//       return next(new AppError('Unauthorized'));
//     }
//     return res.status(200).send(user);
//   } catch (error) {
//     console.log('🚀 ~ error:', error);
//     next(new AppError('User not found'));
//   }
// });

// Fallback route (404 handler)
app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

const PORT = 3000;
connectDB()
  .then((res) => {
    console.log('DB connect successfully.');
    app.listen(PORT, () => {
      console.log('Server is successfully listening on port ' + PORT);
    });
  })
  .catch((err) => console.log('Connection to DB failed ' + err));
