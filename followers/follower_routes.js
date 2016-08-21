var _ = require('lodash')

module.exports = function(app) {
    _followers= [];
    
    //create
    app.post('/follower', function(req, res) {
        _followers.push(req.body);
        res.json({info: 'follower created successfully'});
    });
    
    //read
    app.get('/follower', function(req, res) {
       res.send(_followers); 
    });
    
    app.get('/follower/:id', function(req, res) {
       res.send(
           _.find(
               _followers,
               {
                   username: req.params.id
               }
           )
       );
    });
    
    //update
    app.put('/follower/:id', function(req, res) {
        var index = _.findIndex (
            _followers,
            {
                username: req.params.id
            }
        );
        _.merge(_followers[index], req.body);
        res.json({info: 'follower updated successfully'})
    });
    
    //delete
    app.delete('/follower/:id', function(req, res) {
       _.remove(_followers, function(follower) {
           return follower.username === req.params.id;
       });
       res.json({info: 'follower removed successfully'});
    });

    //check if the server is alive
    app.get('/_ping', function(req, res) {
        res.status(200).json({pong: Date.now()})
    });
};