'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { Stacks } = require('../models/stack');
const passport = require('passport');
const router = express.Router();
const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', { session: false });


// Get all stacks
router.get('/', (req, res) => {
    return Stacks.find( {} )
    .then( data => res.json(data))
    .catch( err => {
        console.error(err)
        return res.status(500).json({message: `Internal server error`})
    });
});

// Get single stack
router.get('/:code', (req, res) => {
    const code = req.params.code;
    return Stacks.findOne( { code } )
    .then( data => res.json(data))
    .catch( err => {
        console.error(err)
        return res.status(500).json({message: `Internal server error`})
    });
});

// POST stack to public
// A protected endpoint which needs a valid JWT to access it
router.post('/', jwtAuth, jsonParser, (req, res) => {
    const stack = req.body;
    console.log(stack)
    delete stack['__v']
    // create and return new stack
    return Stacks.update( {"code": stack.code}, {$set: stack}, {upsert: true, safe: true})
    .then( (data) => {
      return res.json(stack);
    })
    .catch( err => {
      console.error(err)
      return res.status(500).json({message: `Internal server error`})
    });
})

  // DELETE stack
  // A protected endpoint which needs a valid JWT to access it
  // Only the author may delete
router.delete('/:code', jwtAuth, (req, res) => {
    const code = req.params.code;
    const username = req.user.username;

    return Stacks.deleteOne( { "code" : code } )
    .then( (data) => {
       console.log(data)
       if(data.n === 1) {
          return res.sendStatus(204);
       }
       else {
           return res.sendStatus(404);
       }
    })
    .catch( err => {
      console.log(err)
      return res.status(500).json({message: `Internal server error`});
    });
})

  
module.exports = { router };