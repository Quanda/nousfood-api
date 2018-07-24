'use strict';

// load packages
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');

// load routers
const { router: authRouter } = require('./routers/auth');
const { router: userRouter } = require('./routers/user');
const { router: signupRouter } = require('./routers/signup');
const { router: nootropicLibraryRouter} = require('./routers/nootropicLibrary');
const { router: stackLibraryRouter} = require('./routers/stackLibrary');

// load auth strategies
const { localStrategy, jwtStrategy } = require('./authStrategies/user');

// load config details
const { PORT, DATABASE_URL, CLIENT_ORIGIN } = require('./config');

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

passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', { session: false });

// ROUTES
app.use('/api/nootropics', nootropicLibraryRouter);
app.use('/api/stacks', stackLibraryRouter);
app.use('/api/auth', authRouter);
app.use('/api/:username', userRouter);
app.use('/api/signup', signupRouter);



// set a catchall for 404 requests
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
