const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const getCoordsForAddress = require('../uitl/location');

let DUMMY_PLACES = [
	{
		id: 'p1',
		title: 'Empire State Building',
		description: 'One of the most famous sky scrapers in the world',
		location: {
			lat: 40.7484474,
			lng: -73.9871516,
		},
		address: '20 W 34th St, New York, NY 10001',
		creator: 'u1',
	},
];

exports.getPlacebyId = (req, res) => {
	const placeId = req.params.pid;
	const place = DUMMY_PLACES.find((p) => {
		return p.id === placeId;
	});

	if (!place) {
		throw new HttpError('Could not find places for provided id', 404);
	}

	res.json({ place });
};

exports.getPlacesByUserId = (req, res, next) => {
	const userId = req.params.uid;
	const places = DUMMY_PLACES.filter((p) => {
		return p.creator === userId;
	});
	if (!places || places.length === 0) {
		return next(new HttpError('Could not find places for provided id', 404));
	}

	res.json({ places });
};

exports.createPlace = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);

		next(new HttpError('Invalid inputs, please check your input', 422));
	}

	const { title, description, address, creator } = req.body;

	let coordinates;
	try {
		coordinates = await getCoordsForAddress(address);
	} catch (error) {
		return next(error);
	}

	const createdPlace = {
		id: uuidv4(),
		title,
		description,
		location: coordinates,
		address,
		creator,
	};
	res.status(201).json({ places: createdPlace });

	DUMMY_PLACES.push(createdPlace);
};

exports.updatePlace = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		throw new HttpError('Invalid inputs, please check your input', 422);
	}
	const createdPlace = ({ title, description } = req.body);
	const placeId = req.params.pid;

	const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
	const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
	updatedPlace.title = title;
	updatedPlace.description = description;

	DUMMY_PLACES[placeIndex] = updatedPlace;

	res.status(200).json({ place: updatedPlace });
};

exports.deletePlace = (req, res) => {
	const placeId = req.params.pid;
	if (DUMMY_PLACES.find((p) => p.id === placeId)) {
		throw new HttpError('Could not find a place for that id');
	}
	DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

	res.status(200).send({ message: 'Place deleted' });
};
