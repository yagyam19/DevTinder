const express = require('express');
const { adminAuth, userAuth } = require('./middlewares/auth');

const app = express();

// app.use('/admin', adminAuth);
app.use('/getAllUsers', (req, res) => {
  throw new Error('Users not found.');
});

app.use('/', (err, req, res, next) => {
  if (err) {
    res.status(500).send('Something went wrong');
  }
});

app.get('/users', userAuth, (req, res, next) => {
  console.log('Its done executing');
  res.send('All the users');
});

app.get('/admin/getAllData', (req, res, next) => {
  res.send('Send all the admins data');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server is successfully listening on port ' + PORT);
});
