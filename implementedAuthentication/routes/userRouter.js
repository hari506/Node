const express = require('express');
const userContorller = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/changePassword',
  authController.protect,
  authController.changePassword
);

router.patch('/updateMe', authController.protect, userContorller.updateMe);
router.route('/').get(userContorller.getAllUsers);
router.route('/:id').get(userContorller.getUserById);

module.exports = router;
