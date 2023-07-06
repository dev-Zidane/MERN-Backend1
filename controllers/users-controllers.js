const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const User = require('../models/user');

const DUMMY_USERS = [
	{
		id: 'u1',
		name: 'Zidane',
		email: 'zidane@gmail.com',
		password: 'test',
		// image:
		// 	'https://media.licdn.com/dms/image/D4E03AQGQEnrHaoM6vA/profile-displayphoto-shrink_200_200/0/1687123112514?e=1692835200&v=beta&t=VzoQ4nGUnHK7Qz9gdhmwPbBUDUwtawpr_Q6cdBSqVEs',
	},
];

exports.getUsers = async (req, res, next) => {
	let users;
	try {
		users = await User.find({}, '-password');
	} catch (err) {
		const error = new HttpError(
			'Fetching users failed, please try again later',
			500
		);
		return next();
	}
	res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

exports.signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		return next(new HttpError('Invalid inputs, please check your input', 422));
	}
	const { name, email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not create a user',
			500
		);
		return next(error);
	}

	if (existingUser) {
		const error = new HttpError(
			'User already exists, please login instead',
			422
		);
		return next(error);
	}

	const createdUser = new User({
		name,
		email,
		image:
			'https://media.licdn.com/dms/image/D4E03AQGQEnrHaoM6vA/profile-displayphoto-shrink_800_800/0/1687123112514?e=1694044800&v=beta&t=l7wts58FrW-7efUZm6iTXKC5IIkmk3JuYr5VTKQO5xU',
		password,
		places: [],
	});

	try {
		await createdUser.save();
	} catch (err) {
		const error = new HttpError('Signing up failed, please try again', 500);
		return next(error);
	}

	res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

exports.loginUser = async (req, res, next) => {
	const { email, password } = req.body;
	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError('Something went wrong, could not login', 500);
		return next(error);
	}

	if (!existingUser || existingUser.password !== password) {
		const error = new HttpError('Invalid credentials, could not login', 401);
		return next(error);
	}

	res.status(200).send({ message: 'User logged in' });
};
