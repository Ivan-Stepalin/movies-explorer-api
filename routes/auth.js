const express = require('express');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRoute = require('./users');
const moviesRoute = require('./movies');
const resourceError = require('./resourceError');
const { loginValidation, registrValidation } = require('../middlewares/validation');

const routes = express.Router();

routes.post('/signup', registrValidation, createUser);
routes.post('/signin', loginValidation, login);

routes.use(auth);
routes.use('/users', usersRoute);
routes.use('/movies', moviesRoute);
routes.use('*', resourceError);

module.exports = routes;
