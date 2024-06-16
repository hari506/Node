const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/me', authController.isLoggedIn, viewsController.getUser);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/reviews', authController.isLoggedIn, viewsController.getMyReviews);
router.get(
  '/bookings',
  authController.isLoggedIn,
  viewsController.getMyBookings
);

router.get(
  '/billing',
  authController.isLoggedIn,
  viewsController.getMyBillings
);
module.exports = router;
