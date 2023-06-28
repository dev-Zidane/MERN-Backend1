const usersController = require('../controllers/users-controllers');

const express = require('express');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post('/signup', usersController.createUser);

router.post('/login', usersController.loginUser);

module.exports = router;
