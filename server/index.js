var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('client'));

app.get('/hi', function(req, res) {
  res.status(200).send('Hello motherfuckers');
});

var board = null;
var boardStatus = {};

io.on('connection', function(socket){
	console.log('Nuevo cliente conectado ' + socket.handshake.address);

	socket.on('new-board', function(data){
		console.log("NEW BOARD!");
		board = socket;
	}).on('new-board-status', function(data){
		boardStatus = data;
		io.sockets.emit('board-status', data);
	}).on('toggle-led', function(data){
		console.log('Invoke: toggle-led');
		if (board != null) {
			board.emit('toggle-led', {});
			console.log('Sended: toggle-led');
		}
	});

	if (board != null) {
		socket.emit('board-status', boardStatus);
	} else {
		socket.emit('board-status', {});
	}
});

var PORT = process.argv[2] || 8080;

server.listen(PORT, function() {
	console.log('Server runing on port: '+PORT);
});



