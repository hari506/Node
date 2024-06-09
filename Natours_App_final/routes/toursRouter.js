const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRouter');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);
router
  .route('/top-5-cheptours')
  .get(tourController.addAliasingForTop5CheepTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.toursStats);
router.route('/monthly-plan').get(tourController.getMonthlyPlan);
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTourById)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
