var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String
});

module.exports = mongoose.model('User', userSchema);