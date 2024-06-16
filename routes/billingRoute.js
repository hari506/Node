const express = require('express');
const billingController = require('./../controllers/billingController');
const authController = require('./../controllers/authController');

router = express.Router();

router
  .route('/')
  .get(authController.protect, billingController.getAllBillings)
  .post(authController.protect, billingController.insertBilling);

router
  .route('/:id')
  .get(authController.protect, billingController.getBillingById)
  .patch(authController.protect, billingController.updateBilling)
  .delete(authController.protect, billingController.deleteBilling);
module.exports = router;
