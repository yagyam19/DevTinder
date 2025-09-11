const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const errorHandler = require('./middlewares/error');

app.use(express.json());

app.post('/signup', async (req, res) => {
  const userObj = req.body;
  console.log('🚀 ~ userObj:', userObj);

  // create a new instance of user model
  try {
    const user = new User(userObj);
    await user.save();
    res.send('Sign up successfull!');
  } catch (error) {
    console.log('🚀 ~ error:', error);
    res.status(400).send('Error signing up the user.' + error);
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
    res.status(400).send({ message: 'Error in getting the users ' + error });
  }
});

app.put('/update/user', async (req, res, next) => {
  try {
    const { userId, ...rest } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, rest, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(400).send({ message: 'User not found.' });
    }
    res.status(200).send({ message: 'User updated successfully.' });
  } catch (error) {
    console.log('🚀 ~ error:', error);
    res.status(400).send({ message: 'Error in updating the user ' + error });
  }
});

// app.use('/', (err, req, res, next) => {
//   if (err) res.send('Something went wrong.');
//   next();
// });

// DELETE /delete/user/123
app.delete('/delete/user', async (req, res, next) => {
  try {
    console.log('🚀 ~ req.query:', req);
    const { userId } = req.query;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(400).send('User not found.');
    }
    res.status(200).send('User deleted successfully');
  } catch (error) {
    res.status(400).send('Something went wrong');
  }
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
