var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/main_new.js', function (req, res) {
  res.sendFile(__dirname + '/main_new.js');
});

app.get('/atlas.png', function (req, res) {
  res.sendFile(__dirname + '/atlas.png');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

io.on('connection', function(socket){
  socket.on('message', function(msg){
    // console.log('message: ' + msg);
    io.emit('message', msg);
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
