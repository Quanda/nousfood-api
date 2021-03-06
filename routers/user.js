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
router.get('/stacks/:code', (req, res) => {
  const username = req.baseUrl.split('/')[2]
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

// UPDATE stack
// A protected endpoint which needs a valid JWT to access it
router.put('/stacks/:code', jwtAuth, (req, res) => {
  const username = req.user.username;
  const code = req.params.code;
  const updateData = req.body;

  let set = {};
  Object.keys(updateData).forEach((key) => {
    set['saved_stacks.$.' + key] = updateData[key];
  })

  let query = { username: username, "saved_stacks.code": code },
      update = { $set: set }

  return User.findOneAndUpdate(query, update)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      return res.status(500).json({message: `Internal server error`});
    })
});

// POST nootropic
// A protected endpoint which needs a valid JWT to access it
router.post('/nootropics', jwtAuth, (req, res) => {
  const username = req.user.username;
  const nootropic = req.body;

  // create and return new stack
  return User.update( {username}, {$push: { 'followed_nootropics': nootropic }} )
  .then( (data) => res.json(nootropic))
  .catch( err => {
    console.error(err)
    return res.status(500).json({message: `Internal server error`})
  });
})

// DELETE nootropic
router.delete('/nootropics/:code', jwtAuth, (req, res) => {
  const code = req.params.code;
  const username = req.user.username;
  return User.update( {username}, {$pull: { 'followed_nootropics': { code }} } )
  .then( (data) => {
    console.log(data)
     if(data.nModified > 0) {
        return res.sendStatus(204);
     }
     else {
         console.log('hmm')
         return res.sendStatus(404);
     }
  })
  .catch( err => {
    console.log(err)
    return res.status(500).json({message: `Internal server error`});
  });
})

// GET followed nootropics
// A protected endpoint which needs a valid JWT to access it
router.get('/nootropics', jwtAuth, (req, res) => {
  const username = req.user.username;

  // return followed nootropics
  return User.findOne({username}, 'followed_nootropics')
  .then( (data) => {
    res.json(data.followed_nootropics);
  })
  .catch( err => {
    console.error(err)
    return res.status(500).json({message: `Internal server error`})
  });
})

module.exports = { router };
