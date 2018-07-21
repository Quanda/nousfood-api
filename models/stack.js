'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const StackSchema = mongoose.Schema({
    name: String,
    author: String,
    code: String,
    contents: [
        [Nootropic]
    ],
    directive: String,
    description: String
});

const Stack = mongoose.model('Stack', StackSchema);

module.exports = { Stack };
