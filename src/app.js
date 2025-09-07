const express = require('express');

const app = express();

// app.use('/profile', (req, res) => {
//   res.send('profile is here');
// })

// ********* Advanced routing concept
// app.get('/ab?c', (req, res) => {
//   res.send({ firstName: 'Yagyam', lastName: 'Patidar', rank: 10 });
// });

// Matches both /abc and /bc
// app.get('ab+c', (req, res) => {
//   res.send("Matched abc or bc");
// });

// this will match all the get api calls to this route.
app.get('/profile/:userId', (req, res) => {
  console.log(req.query, req.params);
  res.send({ firstName: 'Yagyam', lastName: 'Patidar', rank: 10 });
});

app.post('/profile', (req, res) => {
  res.send({ message: 'Record created successfully.' });
});

app.delete('/profile', (req, res) => {
  res.send({ message: 'Profile deleted successfully.' });
});

// this will match to all the http method API calls to /test
app.use('/test', (req, res) => {
  // request handler
  res.send('Hello Dev Tinder');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server is successfully listening on port ' + PORT);
});
