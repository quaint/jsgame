var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/:name', function (req, res) {
  res.sendFile(__dirname + '/' + req.params.name);
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

io.on('connection', function(socket){
  socket.on('combine', function(combine){
    socket.broadcast.emit('combine', combine);
  });
});

io.on('connection', function(socket){
  socket.on('empty', function(msg){
    socket.broadcast.emit('empty', msg);
  });
});

io.on('connection', function(socket){
  socket.on('straw', function(msg){
    socket.broadcast.emit('straw', msg);
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
