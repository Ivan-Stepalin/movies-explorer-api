const Movie = require('../models/movie');

const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ServerError = require('../errors/serverError');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(err.message);
      } else {
        throw new ServerError(err.message);
      }
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(new Error('NotFound'))
    .then((data) => {
      if (data) {
        if (req.user._id === data.owner._id.toString()) {
          Movie.findByIdAndRemove(req.params.id)
            .then((movie) => res.send(movie));
        } else if (req.user._id !== data.owner._id.toString()) {
          throw new ForbiddenError('У вас нет прав удалять чужой фильм');
        }
      }
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError('Запрашиваемый фильм не найден');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;

  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    owner,
    movieId,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(err.message);
      } else {
        throw new ServerError(err.message);
      }
    })
    .catch(next);
};
