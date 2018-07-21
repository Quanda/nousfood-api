'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const StackLibrarySchema = mongoose.Schema({
   data: [stack]
});

const StackLibrary = mongoose.model('StackLibrary', StackLibrarySchema);

module.exports = { StackLibrary };
