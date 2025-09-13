const express = require('express');
require('dotenv').config();
const connectDB = require('./config/database');
const app = express();
const errorHandler = require('./middlewares/error');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/AppError');

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const userRouter = require('./routes/user');
const requestRouter = require('./routes/request');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', userRouter);
app.use('/', requestRouter);

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
