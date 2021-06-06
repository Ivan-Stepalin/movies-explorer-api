const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const AuthorizedError = require('../errors/authorizedError');
const ConflictError = require('../errors/conflictError');
const ServerError = require('../errors/serverError');

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError(err.message);
      } else if (err.name === 'CastError') {
        throw new BadRequestError(err.message);
      } else {
        throw new ServerError(err.message);
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError(err.message);
      } else if (err.name === 'CastError') {
        throw new BadRequestError(err.message);
      } else {
        throw new ServerError(err.message);
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, name } = req.body;

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res
      .status(200)
      .send({ data: { _id: user._id, email: user.email, name: user.name } }))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflictError(err.message);
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError(err.message);
      } else {
        throw new ServerError(err.message);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      const data = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
      res.send({ data, token });
    })
    .catch((err) => {
      throw new AuthorizedError(err.message);
    })
    .catch(next);
};
