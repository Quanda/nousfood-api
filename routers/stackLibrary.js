'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { Stacks } = require('../models/stack');

const router = express.Router();
const jsonParser = bodyParser.json();


// Get all Stacks
router.get('/', (req, res) => {
    return Stacks.find( {}, function(err, stacks) {
        if (err) console.error(err);
        return res.json(stacks);
    })
});

module.exports = { router };