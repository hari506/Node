const AppErrorHandler = require('../utilities/AppErrorHandler');
const usersModel = require('./../models/usersModel');
const catchAsyncErrors = require('./../utilities/catchAsyncErrors');

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
exports.getAllUsers = catchAsyncErrors(async (req, res) => {
  let users = await usersModel.find();
  res.status(200).json({
    status: 'success',
    data: {
      ...users,
    },
  });
});

exports.getUserById = (req, res) => {
  let id = req.params.id * 1;
  let user = ''; //users.find((user) => user.id === id);
  if (!user) {
    return res.status(404).json({
      status: 'failed',
      message: 'User not Found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      ...user,
    },
  });
};

exports.updateMe = catchAsyncErrors(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppErrorHandler(
        "you can't update password in this action, user /changePassword action",
        400
      )
    );
  }

  let filteredBody = filterObject(req.body, 'name', 'email');

  let updatedUser = await usersModel.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    stattus: 'success',
    data: {
      user: updatedUser,
    },
  });
});
