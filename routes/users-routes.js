const express = require('express');

const router = express.Router();

const DUMMY_USERS = [
	{
		id: 'u1',
		name: 'Zidane',
		email: 'zidane@gmail.com',
		image:
			'https://media.licdn.com/dms/image/D4E03AQGQEnrHaoM6vA/profile-displayphoto-shrink_200_200/0/1687123112514?e=1692835200&v=beta&t=VzoQ4nGUnHK7Qz9gdhmwPbBUDUwtawpr_Q6cdBSqVEs',
	},
];

router.get('/:uid', (req, res) => {
	const userId = req.params.uid;
	const user = DUMMY_USERS.find((uid) => {
		return uid.id === userId;
	});
	res.json({ user });
});

module.exports = router;
