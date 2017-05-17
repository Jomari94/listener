var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
