const mongoose = require('mongoose');

const bookingModel = new mongoose.Schema({
  user_id: String,
  flight: Object
});

const Booking = mongoose.model('Booking', bookingModel);
module.exports = Booking;
