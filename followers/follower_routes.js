//var _ = require('lodash')
var Follower = require('../followers/follower_model.js')

module.exports = function(app) {
    
    //create
    app.post('/followers', function(req, res) {
        //validate request body before saving it in the db; if not valid issue status: 400 - Bad Request
        req.checkBody('username', 'please enter a username').notEmpty();
        req.checkBody('follower_username', 'please enter a username to follow').notEmpty();

        var errors = req.validationErrors();
        if(errors) {
            //req.body payload is faulty.  Display error to end user
            console.log(errors);
            res.status(400).json({info: 'cannot create tweet', error: errors});
            return;
        } else {    //request.body is validated. proceed with POST process.
            //check if you have already followed this user
            Follower.findOne({username: req.body.username, follower_username: req.body.follower_username}, function (err, follower) {  
                if(err) {
                    // error
                    console.log(err);
                    res.status(500).json({info: 'error during following user', error: err});
                    return;
                };
                if(follower) {
                    // follower_username found!  do not allow duplicate.
                    console.log('followers - 409: you have already followed this user');
                    res.status(409).json({info: 'you have already followed this user', data: follower});
                } else {     
                    var newFollower = new Follower(req.body);
                    newFollower.save(function(err){
                        if(err) {
                            console.log(err);
                            res.status(500).json({info: 'error during processing follow post', error: err});
                        };
                        res.status(201).json({info: 'Follow request has been processed'});
                    });
                }
            });
        }

    });
    
    //read
    app.get('/followers', function(req, res) {
       Follower.find(function(err, followers) {
            if(err) {
                console.log(err);
                res.status(500).json({info: 'error during find users', error: err});
                return;
            };
            res.status(200).json({info: 'tweets found successfully', data: followers});
        }); 
    });
    
    app.get('/followers/:id', function(req, res) {
       Follower.find({username: req.params.id}, function (err, follower) {  
            if(err) {
                console.log(err);
                res.status(500).json({info: 'error during find tweet', error: err});
                return;
            };
            if(follower) {
                // success
                res.status(200).json({info: 'tweet found successfully', data: follower});
            } else {
                // No content found
                res.status(204).json({info: 'tweet not found'});
            }
        }); 
    });

    //unfollow user
    //http://127.0.0.1:3002/followers/ahmad/users/omar
    app.delete('/followers/:username/users/:follower_username', function(req, res) {
       Follower.findOne({username: req.params.username, follower_username: req.params.follower_username}, function (err, follower) {    
            if(err) {
                //error removing follow user
                console.log(err);
                res.status(500).json({info: 'error during user unfollow', error: err});
                return;
            };
            //remove successful 200 or 204 can be used here
            if(follower) {
                follower.remove(function (err) {
                    if(err) {
                        // error something went wrong
                        console.log(err);
                        res.status(500).json({info: 'error during user unfollow delete', error: err});
                        return;
                    };
                    // success and user updated successfully
                    res.status(200).json({info: 'user unfollow successfully'});
                }); 
            } else {
                res.status(204).json({info: 'No user found to unfollow'});
            }
        });
    });


    //check if the server is alive
    app.get('/_ping', function(req, res) {
        res.status(200).json({pong: Date.now()})
    });
};