const express = require('express');
const router = express.Router();
const Booking = require('../models/booking.js');

router.get('/', (req, res) => {
    Booking.find({user_id: req.query.user_id}, (err, newBooking) => {
      if(err){
        console.log(err);
      }else{
        console.log(newBooking);
        res.json(newBooking)
      }
    });
});

router.post('/', (req, res) => {
    Booking.create(req.body, (err, newBooking) => {
      if(err){
        console.log(err);
      }else{
        res.json(newBooking)
      }
    });
});

router.delete('/:id', (req, res) => {
  Booking.findByIdAndRemove(req.params.id, (err, deletedFlight) => {
    if(err){
      console.log(err);
    }else{
      res.json(deletedFlight)
    }
  });
});

module.exports = router;
