const routes = require('express').Router();
const { resourceError } = require('../controllers/resourceError');

routes.all('/', resourceError);

module.exports = routes;
