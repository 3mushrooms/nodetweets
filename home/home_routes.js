/*
* Request file that makes requests to inner microsevices.
*/
var r = require('request').defaults( {
    json: true
});

var async = require('async')

module.exports = function(app) {
    //read
    app.get('/home', function(req, res) {
        async.parallel( {
            tweets: function(callback) {
                r({ uri: 'http://localhost:3001/tweets'}, function(error, response, body) {
                    if(error ) {
                        callback({server: 'tweets', error: error});
                        return;
                    };
                    if (!error && response.statusCode === 200) {
                        callback(null, body);
                    } else {
                        callback(response.statusCode);
                    }    
                });
            },
            users: function(callback) {
                r({ uri: 'http://localhost:3000/users'}, function(error, response, body) {
                    if(error ) {
                        callback({server: 'users', error: error});
                        return;
                    };
                    if (!error && response.statusCode === 200) {
                        callback(null, body);
                    } else {
                        callback(response.statusCode);
                    }    
                });
            }, 
            followers: function(callback) {
                r({ uri: 'http://localhost:3002/followers'}, function(error, response, body) {
                    if(error ) {
                        callback({server: 'followers', error: error});
                        return;
                    };
                    if (!error && response.statusCode === 200) {
                        callback(null, body);
                    } else {
                        callback(response.statusCode);
                    }    
                });
            }
        },
        function (error, results) {
            res.status(404).json({
                error: error,
                results: results
            });
        });
    });

    //check if the server is a live
    app.get('/home/ping', function(req, res) {
        res.status(200).json({pong: Date.now()})
    });
};