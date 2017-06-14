// Load required packages
var mongoose = require('mongoose');
var random = require('mongoose-random');


// Define our beer schema
var WordSchema   = new mongoose.Schema({
  nativeWord: String,
  translatedWord: String,
  language: String
});

WordSchema.plugin(random);

// Export the Mongoose model
module.exports = mongoose.model('Word', WordSchema);