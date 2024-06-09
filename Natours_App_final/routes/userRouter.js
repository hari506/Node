const express = require('express');
const userContorller = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/changePassword',
  authController.protect,
  authController.changePassword
);

router.route('/').get(userContorller.getAllUsers);
router
  .route('/:id')
  .get(userContorller.getUserById)
  .patch(
    authController.protect,
    userContorller.uploadUserPhoto,
    userContorller.updateMe
  )
  .delete(userContorller.deleteUser);

module.exports = router;
