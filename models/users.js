const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userModel);
module.exports = User;
