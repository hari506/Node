const catchAsyncError = require('./../utilities/catchAsyncErrors');
const AppErrorHandler = require('./../utilities/AppErrorHandler');
const APIFeatures = require('./../utilities/APIFeatures');

exports.getOne = (Model, populateObj) => {
  return catchAsyncError(async (req, res, next) => {
    console.log('tours ID123', req.params);
    let query = Model.findById(req.params.id);
    if (populateObj) {
      query = query.populate(populateObj);
    }
    let doc = await query;
    if (!doc) {
      return next(new AppErrorHandler('Doc not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
};

exports.createOne = (Model) => {
  return catchAsyncError(async function (req, res, next) {
    console.log(req.body);
    let doc = await Model.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
};

exports.updateOne = (Model) => {
  return catchAsyncError(async (req, res, next) => {
    let doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppErrorHandler('Document not found', 404));
    }

    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
};

exports.deleteOne = (Model) => {
  return catchAsyncError(async (req, res, next) => {
    let doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppErrorHandler('the tour not found!', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};

exports.getAll = (Modal) => {
  return catchAsyncError(async (req, res, next) => {
    let filterObj = {};
    if (req.params.tourId) {
      filterObj = { tour: req.params.tourId };
    }

    let features = new APIFeatures(Modal.find(filterObj), req.query, Modal)
      .filter()
      .sort()
      .limit()
      .pagination();

    let docs = await features.query;

    //sending results
    res.status(200).json({
      status: 'success',
      result: docs.length,
      data: {
        docs,
      },
    });
  });
};
