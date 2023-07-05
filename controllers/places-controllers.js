const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const Place = require('../models/place');
const getCoordsForAddress = require('../util/location');

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

exports.getPlacebyId = async (req, res, next) => {
	const placeId = req.params.pid;

	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not find a place',
			500
		);
		return next(error);
	}
	if (!place) {
		const error = new HttpError('Could not find place for provided id', 404);
		return next(error);
	}
	res.json({ place: place.toObject({ getters: true }) });
};

exports.getPlacesByUserId = async (req, res, next) => {
	const userId = req.params.uid;
	let places;
	try {
		places = await Place.find({ creator: userId });
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not find a place',
			500
		);
		return next(error);
	}

	if (!places || places.length === 0) {
		return next(new HttpError('Could not find places for provided id', 404));
	}

	res.json({
		places: places.map((place) => place.toObject({ getters: true })),
	});
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

	const createdPlace = new Place({
		title,
		description,
		address,
		location: coordinates,
		image:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
		creator,
	});
	try {
		await createdPlace.save();
	} catch (err) {
		const error = new HttpError('Error creating place', 500);
		return next(error);
	}
	res.status(201).json({ places: createdPlace });
};

exports.updatePlace = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		return next(new HttpError('Invalid inputs, please check your input', 422));
	}
	const { title, description } = req.body;
	const placeId = req.params.pid;

	let place;

	try {
		place = await Place.findById(placeId);
	} catch (err) {
		const error = new HttpError('Could not update place.', 500);
		return next(error);
	}

	place.title = title;
	place.description = description;

	try {
		await place.save();
	} catch (err) {
		const error = new HttpError(
			'Something went wrong. Could not update place.',
			500
		);
		return next(error);
	}

	res.status(200).json({ place: place.toObject({ getters: true }) });
};
exports.deletePlace = async (req, res, next) => {
	const placeId = req.params.pid;
	let place;
	try {
		place = await Place.findByIdAndDelete(placeId);
	} catch (err) {
		const error = new HttpError('Could not delete place for provided id', 500);
		return next(error);
	}

	if (!place) {
		const error = new HttpError('No place found with that id', 404);
		return next(error);
	}

	res.status(200).send({ message: 'Place deleted' });
};
