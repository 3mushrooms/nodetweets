var _ = require('lodash')
var User = require('../users/user_model.js')

module.exports = function(app) {
    //create
    app.post('/users', function(req, res) {
        //validate request body before processing it; if not valid issue status: 400 - Bad Request
        req.checkBody('username', 'please enter a username').notEmpty();
        req.checkBody('email', 'please enter a valid email address').isEmail();
        req.checkBody('password', 'please enter a valid password').notEmpty();

        var errors = req.validationErrors();
        if(errors) {
            //req.body payload is faulty.  Display error to end user
            console.log(errors);
            res.status(400).json({info: 'cannot create user', error: errors});
            return;
        } else {
            //request.body is valid, proceed with POST operation
            User.findOne({username: req.body.username}, function (err, user) {  
                if(err) {
                    console.log(err);
                    res.status(500).json({info: 'error during create user', error: err});
                    return;
                };
                if(user) {
                    // user found!  do not allow duplicate.
                    console.log('error 409 - cannot create user.  user already exist');
                    res.status(409).json({info: 'cannot create user.  user already exist', data: user});
                    return;
                } else {     
                    var newUser = new User(req.body);
                    newUser.save(function(err){
                        if(err) {
                            console.log(err);
                            res.status(500).json({info: 'error during user create', error: err});
                            return;
                        };
                        res.status(201).json({info: 'user created successfully'});
                        return;
                    });
                }
            });
        }
    });
    
    //search users.  
    //Using searches as a resource and applying a POST request to search against searches resource.
    app.post('/users/searches', function(req, res) {
        //validate req.body. if not valid issue status code 400 bad request
        req.checkBody('username', 'please enter a name to search users').notEmpty();

        var errors = req.validationErrors();
        if(errors) {
            console.log(errors);
            res.status(400).json({info: 'cannot complete search process', error: errors});
            return;
        } else {
            User.find({username: new RegExp(req.body.username, 'i')}, function (err, users) { 
                if(err) {
                    // error
                    console.log(err);
                    res.status(500).json({info: 'error during find user', error: err});
                    return;
                };
                if(users) {
                    // success
                    res.status(200).json({info: 'search results for: ' + req.body.username, data: users});
                    return;
                } else {
                    // No content found
                    res.status(204).json({info: 'user not found'});
                    return;
                }
            });
        }
    });

    //read
    app.get('/users', function(req, res) {
        User.find(function(err, users) {
            if(err) {
                console.log(err);
                res.status(500).json({info: 'error during find users', error: err});
                return;
            };
            res.status(200).json({info: 'users found successfully', data: users});
            return;
        });
    });
    
    app.get('/users/:id', function(req, res) {
        //TODO:  validate req.body. if not valid issue status code 400 bad request
        User.find({username: req.params.id}, function (err, user) {  
            if(err) {
                // error
                console.log(err);
                res.status(500).json({info: 'error during find user', error: err});
                return;
            };
            if(user) {
                // success
                res.status(200).json({info: 'user found successfully', data: user});
                return;
            } else {
                // No content found
                res.status(204).json({info: 'user not found'});
                return;
            }
        });
    });

    
    
    //update
    app.put('/users/:id', function(req, res) {
        //validate req.body. if not valid issue status code 400 bad request
        //validate request body before processing it; if not valid issue status: 400 - Bad Request
        req.checkBody('username', 'please enter a username').notEmpty();
        req.checkBody('email', 'please enter a valid email address').isEmail();
        req.checkBody('password', 'please enter a valid password').notEmpty();

        var errors = req.validationErrors();
        if(errors) {
            //req.body payload is faulty.  Display error to end user
            res.status(400).json({info: 'cannot create user', error: errors});
            return;
        } else {
            User.findOne({username: req.params.id}, function (err, user) {
                if(err) {
                    console.log(err);
                    res.status(404).json({info: 'error during user update', error: err});
                    return;  
                };
                if(user) {
                    _.merge(user, req.body);
                    user.save(function (err) {
                        if(err) {
                            // error something went wrong
                            res.status(500).json({info: 'error during user update', error: err});
                            return;
                        };
                        // success and user updated successfully
                        res.status(200).json({info: 'user updated successfully'});
                        return;
                    });  
                } else {
                    //operation successful but no user found!
                    res.status(204).json({info: 'no user found'});
                    return;
                }
            });
        }
    });
    
    //delete
    app.delete('/users/:id', function(req, res) {
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
                        console.log(err);
                        res.status(500).json({info: 'error during user delete', error: err});
                        return;
                    };
                    // success and user updated successfully
                    res.status(200).json({info: 'user deleted successfully'});
                    return;
                }); 
            } else {
                res.status(204).json({info: 'No user found to delete'});
                return;
            }
        });
    });
    
    //check if the server is alive
    app.get('/_ping', function(req, res) {
        res.status(200).json({pong: Date.now()})
    });

};
