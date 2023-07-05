const { check } = require('express-validator');
const usersController = require('../controllers/users-controllers');

const express = require('express');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post(
	'/signup',
	[
		check('email').normalizeEmail().isEmail().not().isEmpty(),
		check('name').not().isEmpty(),
		check('password').isLength({ min: 5 }),
		// check('image').isURL(),
	],
	usersController.signup
);

router.post('/login', [], usersController.loginUser);

module.exports = router;
