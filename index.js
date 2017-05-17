var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);

io.set('origins', '*:*');

http.listen(process.env.PORT || 3000, function(){
    console.log('listening');
});

io.on('connection', function(socket){
    console.log('a user connected');
        socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
      console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});
