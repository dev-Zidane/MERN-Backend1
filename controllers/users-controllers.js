const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

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

exports.getUsers = (req, res, next) => {
	res.json({ users: DUMMY_USERS });
};

exports.createUser = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		throw new HttpError('Invalid inputs, please check your input', 422);
	}
	const { name, email, password } = req.body;
	const hasUser = DUMMY_USERS.find((u) => u.email === email);
	if (hasUser) {
		throw new HttpError('Could not create user, email already exists', 422);
	}
	const createdUser = {
		id: uuidv4(),
		name,
		email,
		password,
		// image,
	};
	DUMMY_USERS.push(createdUser);

	res.status(201).json({ users: createdUser });
};

exports.loginUser = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		throw new HttpError('Invalid inputs, please check your input', 422);
	}
	const { email, password } = req.body;

	const users = DUMMY_USERS.find((user) => user.email === email);

	if (!users || users.password !== password) {
		throw new HttpError('Could not find user for provided id', 404);
	}

	res.status(200).send({ message: 'User logged in' });
};
