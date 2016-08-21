var _ = require('lodash')
var User = require('../users/user_model.js')

module.exports = function(app) {
        
    //create
    app.post('/user', function(req, res) {
        //TODO: validate request body before saving it in the db; if not valid issue status: 400 - Bad Request
        //TODO:  check for duplicate. if a username already found, do not allow and send reponse 409 conflict
        User.findOne({username: req.body.username}, function (err, user) {  
            if(err) {
                // error
                res.status(404).json({info: 'error during create user', error: err});
                return;
            };
            if(user) {
                // user found!  do not allow duplicate.
                res.status(409).json({info: 'cannot create user.  user already exist', data: user});
            } else {     
                var newUser = new User(req.body);
                newUser.save(function(err){
                    if(err) {
                        res.status(404).json({info: 'error during user create', error: err});
                    };
                    res.status(201).json({info: 'user created successfully', req: req.params.username});
                });
            }
        });
    });
    
    //read
    app.get('/user', function(req, res) {
        User.find(function(err, users) {
            if(err) {
                res.status(404).json({info: 'error during find users', error: err});
                return;
            };
            res.status(200).json({info: 'users found successfully', data: users});
        });
    });
    
    app.get('/user/:id', function(req, res) {
        //TODO:  validate req.body. if not valid issue status code 400 bad request
        User.find({username: req.params.id}, function (err, user) {  
            if(err) {
                // error
                res.status(404).json({info: 'error during find user', error: err});
                return;
            };
            if(user) {
                // success
                res.status(200).json({info: 'user found successfully', data: user});
            } else {
                // No content found
                res.status(204).json({info: 'user not found'});
            }
        });
    });
    
    //update
    app.put('/user/:id', function(req, res) {
        //TODO:  validate req.body. if not valid issue status code 400 bad request
        User.findOne({username: req.params.id}, function (err, user) {
            if(err) {
                res.status(404).json({info: 'error during user update', error: err});
                return;  
            };
            if(user) {
                _.merge(user, req.body);
                user.save(function (err) {
                    if(err) {
                        // error something went wrong
                        res.status(404).json({info: 'error during user update', error: err});
                        return;
                    };
                    // success and user updated successfully
                    res.status(200).json({info: 'user updated successfully'});
                });  
            } else {
                //operation successful but no user found!
                res.status(204).json({info: 'no user found'});
            }
        });
    });
    
    //delete
    app.delete('/user/:id', function(req, res) {
        //TODO:  validate req.body. if not valid issue status code 400 bad request
        //User.findByIdAndRemove(req.params.id, function (err) {
        User.findOne({username: req.params.id}, function (err, user) {    
            if(err) {
                //error removing user
                res.status(404).json({info: 'error during user delete', error: err});
                return;
            };
            //remove successful 200 or 204 can be used here
            if(user) {
                user.remove(function (err) {
                    if(err) {
                        // error something went wrong
                        res.status(404).json({info: 'error during user delete', error: err});
                        return;
                    };
                    // success and user updated successfully
                    res.status(200).json({info: 'user deleted successfully'});
                }); 
            } else {
                res.status(204).json({info: 'No user found to delete'});
            }
        });
    });
    
    //check if the server is alive
    app.get('/_ping', function(req, res) {
        res.status(200).json({pong: Date.now()})
    });
};