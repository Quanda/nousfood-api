'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const NootropicSchema = mongoose.Schema({
    code: String,
    name: String,
    substance: String,
    how_to_take: String,
    supports: [
        String 
    ],
    notes: [
        String
    ]
});

const Nootropics = mongoose.model('Nootropic', NootropicSchema);

module.exports = { Nootropics };
