const catchAsyncError = require('./../utilities/catchAsyncErrors');
const AppErrorHandler = require('./../utilities/AppErrorHandler');
const APIFeatures = require('./../utilities/APIFeatures');

exports.getOne = (Model, populateObj) => {
  return catchAsyncError(async (req, res, next) => {
    let doc = await Model.findById(req.params.id).populate(populateObj);
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
    console.log(req.params.tourId);
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
