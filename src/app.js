const express = require('express');

const app = express();

// middlewares = function executed between incoming request to request handlers are known as middlewares.

// when you call any api it firstly goes through the middleware chain and then when it find the request
// handler then it will sends back to the response.

// GET (/users) => middleware chain => request handlers (sends response back).

app.use('/', (req, res, next) => {
  console.log('Starting the checks');
  next();
});

app.get('/profile', (req, res, next) => {
  console.log('Preparing the data.');
  res.send('Hello From profile page.');
});

// different ways to pass route handlers (some can be in array, some can be in comma seperation);
// app.use('/routes', [rh, rh1, rh2], rh3, ...)

// with app.use you can handle any type of request whether its GET, PUT, POST, DELETE, or PATCH
// app.use(
//   '/profile',
//   [(req, res, next) => {
//     console.log('Preparing data...');
//     next();
//     // res.send('starting data fetching');
//   },
//   (req, res, next) => {
//     console.log('sending...')
//     next();
//   },
//   (req, res, next) => {
//     console.log('taking some more time....');
//     next();
//   }],
//   (req, res) => {
//     const data = { firstName: 'Yagyam', lastName: 'Patidar' };
//     res.send(data);
//     console.log('finally data is sent');
//   }
// );

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server is successfully listening on port ' + PORT);
});
