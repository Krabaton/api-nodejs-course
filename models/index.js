const mongoose = require('mongoose');
let uri;
require('dotenv').config();

mongoose.Promise = global.Promise;

if (process.env.DB === 'testing') {
  uri = process.env.uriDBTest;
} else {
  uri = process.env.uriDB;
}

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(
  uri,
  { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }
);

mongoose.connection.on('connected', () => {
  if (process.env.DB !== 'testing')
    console.log(`Mongoose connection open ${uri}`);
});

mongoose.connection.on('error', err => {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection disconnected app termination');
    process.exit(0);
  });
});
