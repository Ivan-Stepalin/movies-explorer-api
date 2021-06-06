const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')
const userRoute = require('./routes/users')
const {createUser, login} = require("./controllers/users");
const {errors} = require('celebrate')
const auth = require('./middlewares/auth')

const app = express();

const {PORT = 3000} = process.env;

app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})

app.post('/signup', createUser)
app.post('/signin', login)

app.use(auth)

app.use('/users', userRoute)

app.use(errors())
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.listen(PORT)