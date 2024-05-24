const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const usersModle = require('./../models/usersModel');
const catchAsyncErrors = require('./../utilities/catchAsyncErrors');
const AppErrorHandler = require('../utilities/AppErrorHandler');
const sendMail = require('./../utilities/sendEmail');
const crypto = require('crypto');

const JwtSignToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

const createAndSendJwtToken = (user, statusCode, res) => {
  let token = JwtSignToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsyncErrors(async (req, res, next) => {
  let newUser = await usersModle.create(req.body);
  createAndSendJwtToken(newUser, 201, res);
});

exports.login = catchAsyncErrors(async (req, res, next) => {
  //1)please check email and password exist in the req
  let { password, email } = req.body;
  if (!password || !email) {
    return next(new AppErrorHandler('please provide email and password', 401));
  }

  //2)check user exist and password is correct
  let user = await usersModle.findOne({ email }).select('+password');
  let isValidPassword = await user.correctPassword(password, user.password);
  if (!user || !isValidPassword) {
    return next(new AppErrorHandler('Incorrect email or password!', 401));
  }

  //3)every thing ok send token to client
  createAndSendJwtToken(user, 200, res);
});

exports.protect = catchAsyncErrors(async (req, res, next) => {
  //1)check token exist in the req
  let token = '';
  if (
    req.headers.authorization &&
    `${req.headers.authorization}`.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppErrorHandler('you are not logged in!, please login', 401)
    );
  }

  //2)verification of token

  let decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //3)check if user still exist
  let currentUser = await usersModle.findById(decode.id);

  if (!currentUser) {
    return next(
      new AppErrorHandler('the user belong to the token, no longer exist!', 401)
    );
  }
  //4)check if the user changed password after token issued
  if (currentUser.checkPasswordChangedAfter(decode.iat)) {
    new next(
      new AppErrorHandler('the password changed after token issued!', 401)
    );
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppErrorHandler("you don't have permission to do this action!")
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  //step 1)  get the use based on the reqest email
  let { email } = req.body;
  if (!email) {
    return next(new AppErrorHandler('please provide email', 401));
  }

  let user = await usersModle.findOne({ email });
  if (!user) {
    return next(
      new AppErrorHandler('User doest not exist with the give email', 401)
    );
  }

  //step 2) generate the token for reset the password
  let resetToken = user.getResetPwdToken();
  await user.save({ validateBeforeSave: false });

  //setp 3) Send reset token to users email

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL} \nIf you didn't forget your password, please ignore this email!`;
  try {
    await sendMail({
      email: user.email,
      subject: 'Your password reset token valid upto 10 minutes',
      message,
    });
  } catch (err) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    user.save({ validateBeforeSave: false });
    return next(
      new AppErrorHandler(
        'mail is not sent, please try again after some time!',
        401
      )
    );
  }
  res.status(200).json({
    status: 'success',
    message:
      'please set the password using the link, which is sent to your email',
  });
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //step 1) get the user from token

  let hasedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  let user = await usersModle.findOne({
    passwordResetToken: hasedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppErrorHandler('password reset expired!', 400));
  }

  //step 2) if the token doesn't expired, set the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //step 3) set the passwordchangedAt filed
  //step 4) if all ok login the user
  let token = JwtSignToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.changePassword = catchAsyncErrors(async (req, res, next) => {
  // step 1) check the posted data
  let { oldPassword, password, confirmPassword } = req.body;
  if (!oldPassword || !password || !confirmPassword) {
    return next(new AppErrorHandler('some data missed!', 400));
  }

  //step 2) check posted password is correct
  let user = await usersModle.findById(req.user.id).select('+password');
  let isValidPassword = await user.correctPassword(oldPassword, user.password);

  if (!isValidPassword) {
    return next(new AppErrorHandler('the oldpassword is not correct!', 400));
  }
  //step 3) update the password
  user.password = password;
  user.passwordConfirm = confirmPassword;
  await user.save();

  //step 4)update passwordChangedAT
  // step 5) login the user, send jwt token
  createAndSendJwtToken(user, 200, res);
});
