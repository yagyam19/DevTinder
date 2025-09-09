const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.post('/signup', async (req, res) => {
  const userObj = {
    firstName: 'Yashashvi',
    lastName: 'Jaiswal',
    email: 'yashashvi@jaiswal.com',
    age: 30,
    gender: 'Male',
    password: 'User@123',
  };

  // create a new instance of user model
  const user = new User(userObj);
  try {
    await user.save();
    res.send('Sign up successfull!');
  } catch (error) {
    console.log('🚀 ~ error:', error);
    res.status(400).send('Error signing up the user.', error);
  }
});

app.use('/', (err, req, res, next) => {
  if (err) res.send('Something went wrong.');
  next();
});

const PORT = 3000;
connectDB()
  .then((res) => {
    console.log('DB connect successfully.');
    app.listen(PORT, () => {
      console.log('Server is successfully listening on port ' + PORT);
    });
  })
  .catch((err) => console.log('Connection to DB failed.', err));
