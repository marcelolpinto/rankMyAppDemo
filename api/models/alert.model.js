const mongoose = require('mongoose');

var Schema = mongoose.Schema({
  createdAt:{
    type: Date,
    default: Date.now
  },
  search: String,
  email: String,
  frequency: String
});

module.exports = mongoose.model('Alert', Schema);