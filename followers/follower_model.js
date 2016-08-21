var mongoose = require('mongoose');

var followerSchema = mongoose.Schema({
    username: String,
    follower_username: String,
});

module.exports = mongoose.model('Follower', followerSchema);