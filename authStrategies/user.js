'use strict';
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models/user');
const { JWT_SECRET } = require('../config');

const localStrategy = new LocalStrategy((id, password, callback) => {
  console.log(`Attempting login for ${id} / ${password}`);
  let _ID;
  if(id.includes('@')) _ID = {email: id}
  else _ID = {username: id}
  let user;
  User.findOne(_ID)
    .then(_user => {
      user = _user;
      if (!user) { 
        console.log('Could not find user with that email or username');
        // Return a rejected promise so we break out of the chain of .thens.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Could not find user with that email or username'
        }); 
      }
      console.log('Validating pw...');
      return user.validatePassword(password);
    })
    // password invalid
    .then(isValid => {
      if (!isValid) {
        console.log('WRONG pw');
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect password'
        });
      }
      console.log('Authenticated successfully!!');
      // password is valid, return user
      return callback(null, user);
    })
    .catch(err => {
      console.log(err);
      if (err.reason === 'LoginError') {
        return callback(null, false, err);
      }
      return callback(err, false);
    });
});


const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256']
  },
  (payload, done) => {
    done(null, payload.user);
  }
);

module.exports = { localStrategy, jwtStrategy };
