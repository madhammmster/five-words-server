// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require("passport");


// Connect to the wordlocker MongoDB
mongoose.connect('mongodb://localhost:27017/five-words');

var jwtStrategy = require('./passport/jwt-strategy');
passport.use(jwtStrategy.strategy);

// Create our Express application
var app = express();

app.use(passport.initialize());

// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({
  extended: true
}));
// parse application/json
app.use(bodyParser.json());



var wordController = require('./controllers/word')(passport);
var userController = require('./controllers/user')(passport);


var router = express.Router();
router.route('/login').post(userController.login);
router.route('/user').post(userController.postUsers).get(userController.getUsers);
router.route('/secret').get(passport.authenticate('jwt', { session: false }), wordController.secret)

// Create our Express router
var wordRouter = express.Router();

// .post(passport.authenticate('jwt', { session: false }), wordController.postWords)
// Create endpoint handlers for /words
wordRouter.route('/words')
  .post(wordController.postWords)
  .get(passport.authenticate('jwt', { session: false }), wordController.getWords);

wordRouter.route('/fiveWords').get(wordController.getFiveWords);
wordRouter.route('/dailyWords').get(wordController.getDailyPackOfWords);

// Create endpoint handlers for /words/:word_id
wordRouter.route('/words/:word_id')
  .get(passport.authenticate('jwt', { session: false }), wordController.getWord)
  .put(passport.authenticate('jwt', { session: false }), wordController.putWord)
  .delete(passport.authenticate('jwt', { session: false }), wordController.deleteWord);

// Register all our routes with /api
app.use('/api', wordRouter);
app.use('/', router);

// Start the server
app.listen(3000, function() {
  console.log("Express running");
});