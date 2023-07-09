const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
	const error = new HttpError('Could not find this route');
	throw error;
});

app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || 'An unknown error occurred' });
});

mongoose
	.connect(
		'mongodb+srv://zidaneinnis:gPwAbn16rdSur53h@cluster0.g3p0pyi.mongodb.net/places'
	)
	.then(() => {
		app.listen(5000);
	})
	.catch((error) => {
		console.log(error);
	});
