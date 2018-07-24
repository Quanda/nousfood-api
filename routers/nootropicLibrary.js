'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { Nootropics } = require('../models/nootropic');

const router = express.Router();
const jsonParser = bodyParser.json();


// Get all Nootropics
router.get('/', (req, res) => {
    return Nootropics.find( {}, function(err, nootropics) {
        if (err) console.error(err);
        return res.json(nootropics);
    })
});

module.exports = { router };