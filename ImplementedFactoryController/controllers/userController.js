const { findByIdAndDelete } = require('../models/toursModel');
const AppErrorHandler = require('../utilities/AppErrorHandler');
const usersModel = require('./../models/usersModel');
const catchAsyncErrors = require('./../utilities/catchAsyncErrors');
const factoryController = require('./factoryController');

const filterObject = (obj, ...allowedFields) => {
  let newObj = {};
  Object,
    keys(obj).forEach((ele) => {
      if (allowedFields.includes(ele)) {
        newObj[ele] = allowedFields[ele];
      }

      return newObj;
    });
};

exports.prepareUpdateData = (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppErrorHandler(
        'can not update the password using this service!',
        400
      )
    );
  }

  req.body = filterObject(req.body, 'name', 'email');
  req.params.id = req.user.id;
  next();
};

exports.deletecurrentUser = catchAsyncErrors(async (req, res, next) => {
  let deletedUser = await findByIdAndUpdate(
    req.user.id,
    { active: false },
    {
      new: true,
      runValidators: false,
    }
  );

  res.stattus(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = factoryController.getAll(usersModel);
exports.deleteUser = factoryController.deleteOne(usersModel);
exports.updateMe = factoryController.updateOne(usersModel);
exports.getUserById = factoryController.getOne(usersModel);
