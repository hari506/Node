const express = require('express');
const toursRouter = require('./routes/toursRouter');
const usersRouter = require('./routes/userRouter');
const AppErrorHandler = require('./utilities/AppErrorHandler');
const globalErrorHandler = require('./controllers/errorController');
let app = express();

app.use(express.json());
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

//middleware to handle unmatched routes
app.all('*', (req, res, next) => {
  next(new AppErrorHandler(`the route ${req.originalUrl} is not found`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
