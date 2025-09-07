const express = require('express');

const app = express();

app.use('/test', (req, res) => {
  // request handler
  res.send('Hello Dev Tinder');
});

app.use('/welcome', (req, res) => {
  res.send('Welcome to node world.');
});

app.use('/posts', (req, res) => {
      res.send('Here you can see all posts');
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server is successfully listening on port ' + PORT);
});
