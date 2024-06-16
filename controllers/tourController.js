const APIFeatures = require('./../utilities/APIFeatures');
const tourModel = require('./../models/toursModel');
const catchAsyncError = require('./../utilities/catchAsyncErrors');
const AppErrorHandler = require('./../utilities/AppErrorHandler');
const reviewModel = require('./../models/reviewModel');
const factoryController = require('./factoryController');

exports.addAliasingForTop5CheepTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,difficulty,duration,summary,ratingsAverage';
  next();
};

exports.toursStats = catchAsyncError(async (req, res, next) => {
  let tourStats = await tourModel.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numberOfTours: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    {
      $match: { _id: { $ne: 'DIFFICULT' } },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      ...tourStats,
    },
  });
});

exports.getMonthlyPlan = catchAsyncError(async (req, res, next) => {
  let year = req.query.year * 1;
  let monthlyPlan = await tourModel.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfToursStart: { $sum: 1 },
        tour: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numOfToursStart: -1, _id: 1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    result: monthlyPlan.length,
    data: {
      ...monthlyPlan,
    },
  });
});

exports.getTourBySlug = async (req, res, next) => {
  let tour = await tourModel
    .findOne({ slug: req.query.slug })
    .populate('reviews');

  if (!tour) {
    return next(new AppErrorHandler('tour not found !', 401));
  }

  res.status(200).json({
    status: 'sucess',
    tour,
  });
};

exports.getAllTours = factoryController.getAll(tourModel);
exports.deleteTour = factoryController.deleteOne(tourModel);
exports.updateTourById = factoryController.updateOne(tourModel);
exports.createTour = factoryController.createOne(tourModel);
exports.getTourById = factoryController.getOne(tourModel, { path: 'reviews' });
