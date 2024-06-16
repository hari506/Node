const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    bookingController.setUserInfo,
    bookingController.getAllBookings
  )
  .post(authController.protect, bookingController.insertBooking);

router
  .route('/:id')
  .get(authController.protect, bookingController.getBookingById)
  .patch(authController.protect, bookingController.updateBooking)
  .delete(authController.protect, bookingController.deleteBooking);
module.exports = router;
