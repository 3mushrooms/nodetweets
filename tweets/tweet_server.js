var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var validator = require('express-validator');

var mongoose = require('mongoose')
//TODO: connection string can load from a config file
mongoose.connect('mongodb://localhost/tweets')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {
    extended: true
}));
app.use(validator());
var tweets = require('../tweets/tweet_routes.js')(app);

var server = app.listen(3001, function() {
   console.log('Server is running on http://127.0.0.1:3001/'); 
});