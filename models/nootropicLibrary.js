'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const NootropicLibrarySchema = mongoose.Schema({
   data: [nootropic]
});

const NootropicLibrary = mongoose.model('NootropicLibrary', NootropicLibrarySchema);

module.exports = { NootropicLibrary };
