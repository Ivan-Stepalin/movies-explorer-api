const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const userRoute = require('./routes/users');
const movieRoute = require('./routes/movies');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { loginValidation, registrValidation } = require('./middlewares/validation');

require('dotenv').config();

const app = express();

const { PORT = 3000 } = process.env;

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);
app.use(errorLogger);

app.post('/signup', registrValidation, createUser);
app.post('/signin', loginValidation, login);

app.use(auth);

app.use('/users', userRoute);
app.use('/movies', movieRoute);

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.listen(PORT);
