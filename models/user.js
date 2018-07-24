'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Stack = require('./stack');
const StackSchema = mongoose.model('Stack').schema

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
    username: { type: String, required: false, default: '', unique: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true},
    saved_stacks: [StackSchema]
});

UserSchema.methods.serialize = function() {
  return {
    email: this.email || '',
    username: this.username || '',
    firstname: this.firstname || '',
    lastname: this.lastname || ''
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };
