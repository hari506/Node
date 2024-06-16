const multer = require('multer');
//const sharp = require('sharp');
const AppErrorHandler = require('../utilities/AppErrorHandler');
const usersModel = require('./../models/usersModel');
const catchAsyncErrors = require('./../utilities/catchAsyncErrors');
const factoryController = require('./factoryController');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.locals.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppErrorHandler('Not an image! Please upload only images.', 400),
      false
    );
  }
};

let upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

// exports.resizeImage = catchAsyncErrors(async (req, res, next) => {
//   if (!req.file) {
//     return next();
//   }

//   const filename = `user-${req.locals.user.id}-${Date.now()}.jpeg`;

//   await sharp(req.file.buffer)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/users/${filename}`);

//   next();
// });

const filterObject = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach((ele) => {
    if (allowedFields.includes(ele)) {
      newObj[ele] = obj[ele];
    }
  });
  console.log('filter object', newObj);
  return newObj;
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

exports.updateMe = catchAsyncErrors(async (req, res, next) => {
  console.log('this is update me route');
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppErrorHandler(
        'can not update the password using this service!',
        400
      )
    );
  }

  let filteredBody = await filterObject(req.body, 'name', 'email');
  if (req.file) {
    filteredBody.photo = req.file.filename;
  }

  let newUser = await usersModel.findByIdAndUpdate(
    req.locals.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!newUser) {
    return next(
      new AppErrorHandler('error while update, try again after some time!', 500)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

exports.getAllUsers = factoryController.getAll(usersModel);
exports.deleteUser = factoryController.deleteOne(usersModel);
exports.updateuser = factoryController.updateOne(usersModel);
exports.getUserById = factoryController.getOne(usersModel);
