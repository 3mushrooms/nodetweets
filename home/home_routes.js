var r = require('request').defaults( {
    json: true
});

var async = require('async')

module.exports = function(app) {
    //read
    app.get('/home', function(req, res) {
        async.parallel( {
            tweet: function(callback) {
                r({ uri: 'http://localhost:3001/tweet'}, function(error, response, body) {
                    if(error ) {
                        callback({server: 'tweet', error: error});
                        return;
                    };
                    if (!error && response.statusCode === 200) {
                        callback(null, body);
                    } else {
                        callback(response.statusCode);
                    }    
                });
            },
            user: function(callback) {
                r({ uri: 'http://localhost:3000/user'}, function(error, response, body) {
                    if(error ) {
                        callback({server: 'user', error: error});
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