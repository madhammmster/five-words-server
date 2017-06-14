// Load required packages
var Word = require('../models/word');

module.exports = function (passport) {

  var mod = {};
  // Create endpoint /api/words for POSTS
  mod.postWords = function (req, res) {
    // Create a new instance of the Word model
    var word = new Word();

    // Set the word properties that came from the POST data
    word.nativeWord = req.body.nativeWord;
    word.translatedWord = req.body.translatedWord;
    word.language = req.body.language;

    // Save the word and check for errors
    word.save(function (err) {
      if (err)
        res.send(err);

      res.json({ message: 'Word added to the database!', data: word });
    });
  };

  // Create endpoint /api/words for GET
  mod.getWords = function (req, res) {
    // Use the Word model to find all word
    Word.find(function (err, words) {
      if (err)
        res.send(err);

      res.json(words);
    });
  };

  mod.getFiveWords = function (req, res) {
 
    Word.findRandom().limit(5).exec(function (err, words) {
      if (err)
        res.send(err);

      res.json(words);
    });  

  };

  mod.getDailyPackOfWords = function (req, res) {
 
    Word.findRandom().limit(5).exec(function (err, words) {      
      if (err)
        res.send(err);       

        var idArray = [];
        for (var index = 0; index < words.length;index++) {
          var element = words[index];
          idArray.push(element.nativeWord);
        }

        Word.find({nativeWord: {$nin: idArray}}, function(err, otherWords){
          var response = {};

          response.words = words;
          response.otherWords = otherWords;
          
          res.json(response);
        })
      
    });  

  };

  // Create endpoint /api/words/:word_id for GET
  mod.getWord = function (req, res) {
    // Use the Word model to find a specific word
    Word.findById(req.params.word_id, function (err, word) {
      if (err)
        res.send(err);

      res.json(word);
    });
  };

  // Create endpoint /api/words/:word_id for PUT
  mod.putWord = function (req, res) {
    // Use the Word model to find a specific word
    Word.findById(req.params.word_id, function (err, word) {
      if (err)
        res.send(err);

      // Update the existing word quantity
      word.quantity = req.body.quantity;

      // Save the word and check for errors
      word.save(function (err) {
        if (err)
          res.send(err);

        res.json(word);
      });
    });
  };
  mod.secret = function (req, res) {
    res.json({ message: "Success! You can not see this without a token" });
  };

  // Create endpoint /api/words/:word_id for DELETE
  mod.deleteWord = function (req, res) {
    // Use the Word model to find a specific word and remove it
    Word.findByIdAndRemove(req.params.word_id, function (err) {
      if (err)
        res.send(err);

      res.json({ message: 'Word removed from the locker!' });
    });
  };

  return mod;

}