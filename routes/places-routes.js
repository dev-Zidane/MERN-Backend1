const express = require('express');
const { check } = require('express-validator');

const HttpError = require('../models/http-error');
const placesControllers = require('../controllers/places-controllers');

const router = express.Router();

router.get('/:pid', placesControllers.getPlacebyId);

router.get('/users/:uid', placesControllers.getPlacesByUserId);

router.post(
	'/',
	[check('title').not().isEmpty(), check('address').not().notEmpty()],
	placesControllers.createPlace
);

router.patch(
	'/:pid',
	[check('title').not().isEmpty(), check('description').not().notEmpty()],
	placesControllers.updatePlace
);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
