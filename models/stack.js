'use strict';

const mongoose = require('mongoose');
const Nootropics = require('./nootropic');
const NootropicsSchema = mongoose.model('Nootropic').schema

mongoose.Promise = global.Promise;

const StackSchema = mongoose.Schema({
    name: String,
    author: String,
    code: String,
    contents: [NootropicsSchema],
    directive: String,
    description: String
});

const Stacks = mongoose.model('Stack', StackSchema);

module.exports = { Stacks };
