let catchAsyncErrors = require('./../utilities/catchAsyncErrors');
let AppErrorHandler = require('./../utilities/AppErrorHandler');
let reviewModel = require('./../models/reviewModel');
const factoryController = require('./factoryController');

exports.setTourAndUserInfo = (req, res, next) => {
  if (!req.body.tourId) {
    req.query.tour = req.params.tourId;
  }

  if (!req.body.userId && req.user) {
    req.query.userId = req.user.id;
  }

  next();
};

exports.getAllReview = factoryController.getAll(reviewModel);
exports.deleteReview = factoryController.deleteOne(reviewModel);
exports.updateReview = factoryController.updateOne(reviewModel);
exports.createReview = factoryController.createOne(reviewModel);
exports.getReview = factoryController.getOne(reviewModel);
