var express = require('express')
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose')
//TODO: connection string can load from a config file
mongoose.connect('mongodb://localhost/users')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {
    extended: true
}));

var users = require('../users/user_routes.js')(app);

var server = app.listen(3000, function() {
   console.log('Server is running on http://127.0.0.1:3000/'); 
});