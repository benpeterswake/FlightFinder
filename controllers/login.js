const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const bcrypt = require('bcryptjs');

router.post('/', (req, res) => {
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if(user === null){
      res.status(401).json({
        status: 401,
        message: 'No user found'
      });
    }else{
      if(bcrypt.compareSync(req.body.password, user.password)){
        res.status(201).json({
            status:201,
            message: user
            // message:'session created'
        });
      } else {
        res.status(401).json({
            status:401,
            message:'login failed'
        });
      }
    }
  })
});


module.exports = router;
