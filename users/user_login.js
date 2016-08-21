var User = require('../users/user_model.js')

module.exports = function(app) {
        
    //login
    app.post('/login', function(req, res) {
        //validate request body before processing it; if not valid issue status: 400 - Bad Request
        req.checkBody('username', 'please enter a valid username').notEmpty();
        req.checkBody('password', 'please enter a valid password').notEmpty();

        var errors = req.validationErrors();
        if(errors) {
            //req.body payload is faulty.  Display error to end user
            console.log(errors);
            res.status(400).json({info: 'cannot create user', error: errors});
            return;
        } else {
            //request.body is valid, proceed with POST operation
            User.findOne({username: req.body.username, password: req.body.password}, function (err, user) {  
                if(err) {
                    console.log(err);
                    res.status(500).json({info: 'error during create user', error: err});
                    return;
                };
                if(user) {
                    //user found, login successful
                    // user found!  do not allow duplicate.
                    res.status(200).json({info: 'user login successful', data: user});
                    return;
                } else {    
                    //user not fou
                    console.log('user login 404: invalid username or password');
                    res.status(404).json({info: 'login unsuccessful', error: 'invalid username or password'});
                    return;
                }
            });
        }
    });
};