'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const { CLIENT_ORIGIN } = require('./config');

// load packages
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
//const passport = require('passport');

// load routers and auth strategies
//const { router: usersRouter } = require('./users');
//const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

// load config
const { PORT, DATABASE_URL } = require('./config');

mongoose.Promise = global.Promise;

// create express app
const app = express();

// logging
app.use(morgan('common'));

// CORS
app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);


const jwtAuth = passport.authenticate('jwt', { session: false });

app.use('*', (req, res) => {
    return res.status(404).json({ message: 'Aint nothin here' });
});

// both runServer and closeServer need to access the same
// server object, so we declare `server` here, and then when
// runServer runs, it assigns a value.
let server;

// this function starts our server and returns a Promise.
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  console.log(`db url: ${databaseUrl}`);
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
        console.log(databaseUrl);
        if(err) {
            return reject(err);
        }
    })
    server = app.listen(PORT, () => {
      console.log(`Your app is listening on port ${PORT}`);
      resolve();
    }).on('error', err => {
      mongoose.disconnect();
      reject(err);
    });
  });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          reject(err);
        }
      resolve();
      });
    });   
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};


module.exports = { app, runServer, closeServer };
