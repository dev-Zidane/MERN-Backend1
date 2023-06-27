const { v4: uuidv4 } = require('uuid');
const DUMMY_PLACES = [
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
		throw new HttpError('Could not find place for provided id', 404);
	}

	res.json({ place });
};

exports.getPlaceByUserId = (req, res) => {
	const userId = req.params.uid;
	const place = DUMMY_PLACES.find((p) => {
		return p.creator === userId;
	});
	if (!place) {
		return next(new HttpError('Could not find place for provided id', 404));
	}

	res.json({ place });
};

exports.createPlace = (req, res) => {
	const { title, description, coordinates, address, creator } = req.body;
	const createdPlace = {
		id: uuidv4(),
		title,
		description,
		location: coordinates,
		address,
		creator,
	};
	DUMMY_PLACES.push(createdPlace);

	res.status(201).json({ place: createdPlace });
};
