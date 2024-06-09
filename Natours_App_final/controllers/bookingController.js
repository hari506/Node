const bookingModel = require('./../models/bookingModel');
const factoryController = require('./factoryController');

exports.setUserInfo = (req, res, next) => {
  if (req.locals.user) {
    req.query.user = req.locals.user.id;
  }

  if (req.body.tour) {
    req.query.tour = req.body.tour;
  }

  next();
};

exports.getAllBookings = factoryController.getAll(bookingModel);
exports.insertBooking = factoryController.createOne(bookingModel);
exports.getBookingById = factoryController.getOne(bookingModel, {
  path: 'user',
});
exports.updateBooking = factoryController.updateOne(bookingModel);
exports.deleteBooking = factoryController.deleteOne(bookingModel);
