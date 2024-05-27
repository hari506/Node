const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();
router
  .route('/top-5-cheptours')
  .get(tourController.addAliasingForTop5CheepTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.toursStats);
router.route('/monthly-plan').get(tourController.getMonthlyPlan);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTourById)
  .delete(tourController.deleteTour);

module.exports = router;
