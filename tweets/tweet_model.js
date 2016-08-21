var mongoose = require('mongoose');

var tweetSchema = mongoose.Schema({
    username: String,
    tweet: String,
    published: {type: Date, default: Date.now },
});

module.exports = mongoose.model('Tweet', tweetSchema);