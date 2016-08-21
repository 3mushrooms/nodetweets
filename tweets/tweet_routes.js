var _ = require('lodash')

module.exports = function(app) {
    _tweets= [];
    
    //create
    app.post('/tweet', function(req, res) {
        _tweets.push(req.body);
        res.json({info: 'tweet created successfully'});
    });
    
    //read
    app.get('/tweet', function(req, res) {
       res.send(_tweets); 
    });
    
    app.get('/tweet/:id', function(req, res) {
       res.send(
           _.find(
               _tweets,
               {
                   name: req.params.id
               }
           )
       );
    });
    
    //update
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
    
    //delete
    app.delete('/tweet/:id', function(req, res) {
       _.remove(_tweets, function(tweet) {
           return tweet.name === req.params.id;
       });
       res.json({info: 'tweet removed successfully'});
    });

    //check if the server is alive
    app.get('/_ping', function(req, res) {
        res.status(200).json({pong: Date.now()})
    });
};