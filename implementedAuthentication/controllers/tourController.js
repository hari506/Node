const APIFeatures = require('./../utilities/APIFeatures');
const tourModel = require('./../models/toursModel');
const catchAsyncError = require('./../utilities/catchAsyncErrors');
const AppErrorHandler = require('./../utilities/AppErrorHandler');

exports.deleteTour = catchAsyncError(async (req, res, next) => {
  let tour = await tourModel.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppErrorHandler('the tour not found!', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.addAliasingForTop5CheepTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,difficulty,duration,summary,ratingsAverage';
  next();
};

exports.getAllTours = catchAsyncError(async (req, res, next) => {
  let features = new APIFeatures(tourModel.find(), req.query)
    .filter()
    .sort()
    .limit()
    .pagination();

  let tours = await features.query;

  //sending results
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTourById = catchAsyncError(async (req, res, next) => {
  let tour = await tourModel.findById(req.params.id);
  console.log('tour not found');
  if (!tour) {
    return next(new AppErrorHandler('tour not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.updateTourById = catchAsyncError(async (req, res, next) => {
  let tour = await tourModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppErrorHandler('Tour not found', 404));
  }

  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsyncError(async function (req, res, next) {
  let newTour = await tourModel.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

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
