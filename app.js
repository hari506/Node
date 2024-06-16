const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const toursRouter = require('./routes/toursRouter');
const usersRouter = require('./routes/userRouter');
const AppErrorHandler = require('./utilities/AppErrorHandler');
const globalErrorHandler = require('./controllers/errorController');
const reviewRouter = require('./routes/reviewRouter');
const viewsRouter = require('./routes/viewsRouter');
const authController = require('./controllers/authController');
const bookingRouter = require('./routes/bookingRoute');
const billingRouter = require('./routes/billingRoute');

let app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//parse the data to req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cors());
app.use(cookieParser());

app.get('/post', (req, res) => {
  console.log('Connected to React');
  res.status(200).json({
    status: 'success',
    data: 'this is the express server app data',
  });
});

app.use('/', viewsRouter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/billing', billingRouter);

//middleware to handle unmatched routes
app.all('*', authController.isLoggedIn, (req, res, next) => {
  next(new AppErrorHandler(`the route ${req.originalUrl} is not found`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
