var express = require('express')
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {
    extended: true
}));

var home = require('./home/home_routes.js')(app);


var server = app.listen(3005, function() {
   console.log('Server is running on http://127.0.0.1:3005/'); 
});