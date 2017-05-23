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

var people = {};

http.listen(process.env.PORT || 3000, function(){
    console.log('listening');
});

io.on('connection', function(socket){

    socket.on("join", function(name){
        people[socket.id] = name;
        console.log(people[socket.id] + ' connected');
    });

    socket.on('switchRoom', function(newroom){
        // leave the current room (stored in session)
        socket.leave(socket.room);
        // join new room, received as function parameter
        socket.join(newroom);
        socket.room = newroom;
        console.log(socket.room);
        io.in(socket.room).emit('joined', people[socket.id]);
    });

    socket.on('disconnect', function(){
        console.log(people[socket.id] + ' disconnected');
        io.in(socket.room).emit('leave', people[socket.id]);
        delete people[socket.id];
    });

    socket.on('chat message', function(msg){
      console.log('message: ' + msg);
        io.in(socket.room).emit('chat message', msg);
    });
});
