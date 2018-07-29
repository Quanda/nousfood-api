'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const { User } = require('../models/user');

const router = express.Router();
const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', { session: false });

router.use(jsonParser);

// GET user data
// A protected endpoint which needs a valid JWT to access it
router.get('/', jwtAuth, (req, res) => {
  const username = req.user.username;

  // return all stacks
  return User.findOne({username})
  .then( (data) => res.json(data))
  .catch( err => {
    return res.status(500).json({message: `Internal server error`})
  });
})

// GET saved stacks
// A protected endpoint which needs a valid JWT to access it
router.get('/stacks', jwtAuth, (req, res) => {
  const username = req.user.username;

  // return all stacks
  return User.findOne({username}, 'saved_stacks')
  .then( (data) => {
    res.json(data.saved_stacks);
  })
  .catch( err => {
    console.error(err)
    return res.status(500).json({message: `Internal server error`})
  });
})

// GET a specific saved stack
// A protected endpoint which needs a valid JWT to access it
router.get('/stacks/:code', jwtAuth, (req, res) => {
  const username = req.user.username;
  const code = req.params.code;

  // return single stack
  let stack;
  return User.findOne( { username }, {'saved_stacks': { $elemMatch: { code }}} )
  .then( data =>  {
      stack = data.saved_stacks.find(stack => stack.code = code)
      stack ? res.json(stack) : res.sendStatus(404);
  })
  .catch( err => {
    console.error(err)
    return res.status(500).json({message: `Internal server error`})
  });
})

// POST new stack
// A protected endpoint which needs a valid JWT to access it
router.post('/stacks', jwtAuth, (req, res) => {
  const username = req.user.username;
  const newStack = req.body;

  // create and return new stack
  return User.update( {username}, {$push: { 'saved_stacks': newStack }} )
  .then( (data) => res.json(newStack))
  .catch( err => {
    console.error(err)
    return res.status(500).json({message: `Internal server error`})
  });
})

// DELETE stack
router.delete('/stacks/:code', jwtAuth, (req, res) => {
  const code = req.params.code;
  const username = req.user.username;
  return User.update( {username}, {$pull: { 'saved_stacks': { code }} } )
  .then( (data) => {
     if(data.nModified > 0) {
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


/*
// UPDATE stack
// A protected endpoint which needs a valid JWT to access it
router.put('/stacks/:code', jwtAuth, jsonParser, (req, res) => {
  const username = req.user.username;
  const code = req.params.code;
  const updated = req.body;
  console.log(`code is... ${code}`)
  console.log('data to update...')
  console.log(updated)

  let query = { username },
      update = {'saved_stacks.code': code},
      options = {
        $set: {'saved_stacks.$': updated}
      }

  return User.findOneAndUpdate(query, update, options)
    .then(data => {
      console.log('returned from execute...')
      console.log(data);
      res.json(data);
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({message: `Internal server error`});
    })

});
*/
module.exports = { router };
