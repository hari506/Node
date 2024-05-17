const express = require('express');
const userContorller = require('./../controllers/userController');

const router = express.Router();

router.route('/').get(userContorller.getUsers);
router.route('/:id').get(userContorller.getUserById);

module.exports = router;
