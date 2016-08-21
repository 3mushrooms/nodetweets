var mongoose = require('mongoose');

var tweetSchema = mongoose.Schema({
    username: String,
    tweet: String,
});

module.exports = mongoose.model('Tweet', tweetSchema);