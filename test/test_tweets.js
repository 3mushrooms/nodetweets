var r = require('request').defaults( {
    json: true
});

module.exports = function(app) {
    //read
    app.get('/test/tweet', function(req, res) {

        r({ uri: 'http://localhost:3001/tweet'}, function(error, response, body) {
            if(!error && response.statusCode === 200) {
                res.json(body);
            } else {
                res.send(response.statusCode);
            }    
        });
    });
    //POST
    //app.post()
};
