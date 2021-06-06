const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { idValidation, movieValidation } = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', movieValidation, createMovie);
router.delete('/:movieId', idValidation, deleteMovie);

module.exports = router;
