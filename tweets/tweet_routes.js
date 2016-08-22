//var _ = require('lodash')
var Tweet = require('../tweets/tweet_model.js')

module.exports = function(app) {    
    //create
    app.post('/tweets', function(req, res) {
        //Validate request body before saving it in the db; if not valid issue status: 400 - Bad Request
        req.checkBody('username', 'please enter a username').notEmpty();
        req.checkBody('tweet', 'please enter a tweet').notEmpty();

        var errors = req.validationErrors();
        if(errors) {
            //req.body payload is faulty.  Display error to end user
            console.log(errors);
            res.status(400).json({info: 'cannot create tweet', error: errors});
            return;
        } else {
            Tweet.findOne({username: req.body.username, tweet: req.body.tweet}, function (err, tweet) {  
                if(err) {
                    // error
                    console.log(err);
                    res.status(500).json({info: 'error during create user', error: err});
                    return;
                };
                if(tweet) {
                    // exact tweet was previously recorded!  do not allow duplicate.
                    res.status(409).json({info: 'you have already tweeted this message.  Save storage, save earth!', data: tweet});
                    return;
                } else {     
                    var newTweet = new Tweet(req.body);
                    newTweet.save(function(err){
                        if(err) {
                            console.log(err);
                            res.status(500).json({info: 'error during user create', error: err});
                            return;
                        };
                        res.status(201).json({info: 'tweet created successfully'});
                        return;
                    });
                }
            });
        }
    });
    
    //read
    app.get('/tweets', function(req, res) {
       Tweet.find(function(err, tweets) {
            if(err) {
                console.log(err);
                res.status(500).json({info: 'error during find users', error: err});
                return;
            };
            res.status(200).json({info: 'tweets found successfully', data: tweets});
        });
    });
    
    app.get('/tweets/:id', function(req, res) {
       Tweet.find({username: req.params.id}, function (err, tweet) {  
            if(err) {
                // error
                console.log(err);
                res.status(500).json({info: 'error during find tweet', error: err});
                return;
            };
            if(tweet) {
                // success
                res.status(200).json({info: 'tweet found successfully', data: tweet});
            } else {
                // No content found
                res.status(204).json({info: 'tweet not found'});
                return;
            }
        });
    });

    /*
    //TODO: update tweets in mongo
    app.put('/tweet/:id', function(req, res) {
        var index = _.findIndex (
            _tweets,
            {
                name: req.params.id
            }
        );
        _.merge(_tweets[index], req.body);
        res.json({info: 'tweet updated successfully'})
    });
    

    //TODO: support Delete
    app.delete('/tweet/:id', function(req, res) {
       Tweet.findOne({username: req.params.id}, function (err, tweet) {    
            if(err) {
                //error removing user
                res.status(404).json({info: 'error during tweet delete', error: err});
                return;
            };
            //remove successful 200 or 204 can be used here
            if(tweet) {
                tweet.remove(function (err) {
                    if(err) {
                        // error something went wrong
                        res.status(404).json({info: 'error during tweet delete', error: err});
                        return;
                    };
                    // success and user updated successfully
                    res.status(200).json({info: 'tweet deleted successfully'});
                }); 
            } else {
                res.status(204).json({info: 'No tweet found to delete'});
            }
        });
    });
    */

    //check if the server is alive
    app.get('/_ping', function(req, res) {
        res.status(200).json({pong: Date.now()})
    });
};