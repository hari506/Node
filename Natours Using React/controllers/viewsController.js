const multer = require('multer');
const toursController = require('./tourController');
const tourModel = require('./../models/toursModel');
const AppErrorHandler = require('../utilities/AppErrorHandler');
const catchAsyncErrors = require('../utilities/catchAsyncErrors');
const usersModel = require('../models/usersModel');
const bookingModel = require('../models/bookingModel');
const reviewModel = require('../models/reviewModel');
const billingModel = require('../models/billingModel');
exports.getOverview = async (req, res) => {
  let tours = await tourModel.find();
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
};

exports.getTour = async (req, res, next) => {
  let tour = await tourModel
    .findOne({ slug: req.params.slug })
    .populate('reviews');

  if (!tour) {
    return next(new AppErrorHandler('tour not found !', 401));
  }

  res.status(200).render('tour', {
    title: 'Tour Details',
    tour,
  });
};

exports.getLoginForm = async (req, res, next) => {
  res.status(200).render('login');
};

exports.getUser = catchAsyncErrors(async (req, res, next) => {
  let user = await usersModel.findById(res.locals.user?.id);

  if (!user) {
    return next(new AppErrorHandler('user not found!', 404));
  }

  res.status(200).render('account', {
    title: 'user information',
    user,
  });
});

exports.getMyReviews = catchAsyncErrors(async (req, res, next) => {
  let user = await usersModel.findById(res.locals.user?.id);

  if (!user) {
    return next(new AppErrorHandler('User Not logedin', 401));
  }

  let reviews = await reviewModel
    .find({ user: user.id })
    .populate({ path: 'tour' });

  res.status(200).render('myReviews', {
    title: 'My Reviews',
    reviews,
  });
});

exports.getMyBookings = catchAsyncErrors(async (req, res, next) => {
  let user = await usersModel.findById(res.locals.user?.id);
  if (!user) {
    return next(new AppErrorHandler('user not logged in', 404));
  }

  let bookings = await bookingModel
    .find({ user: user.id })
    .populate({ path: 'tour' });
  res.status(200).render('myBookings', {
    title: 'My Bookings',
    bookings,
  });
});

exports.getMyBillings = catchAsyncErrors(async (req, res, next) => {
  let user = await usersModel.findById(res.locals.user?.id);
  if (!user) {
    return next(new AppErrorHandler('user not logged in', 404));
  }

  let billings = await billingModel
    .find()
    .populate({ path: 'booking', populate: { path: 'tour' } });

  console.log(billings);
  res.status(200).render('myBillings', {
    title: 'My Billings',
    billings,
  });
});
