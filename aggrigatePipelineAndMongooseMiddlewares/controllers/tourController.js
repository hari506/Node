const APIFeatures = require('./../utilities/APIFeatures');
const tourModel = require('./../models/toursModel');

exports.deleteTour = async (req, res) => {
  try {
    await tourModel.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.addAliasingForTop5CheepTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,difficulty,duration,summary,ratingsAverage';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getTourById = async (req, res) => {
  try {
    console.log(req.params.id);
    let tour = await tourModel.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.updateTourById = async (req, res) => {
  try {
    let tour = await tourModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 404,
      message: err,
    });
  }
};

exports.createTour = async function (req, res) {
  // let tourdoc = new tourModel({});
  // tourdoc.save().then()
  try {
    let newTour = await tourModel.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      Message: err,
    });
  }
};

exports.toursStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
