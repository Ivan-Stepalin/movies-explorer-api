require('dotenv').config();

const {
  JWT_SECRET = 'dev-secret',
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb',
} = process.env;

module.exports = { JWT_SECRET, PORT, MONGO_URL };
