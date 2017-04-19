var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('client'));

app.get('/hi', function(req, res) {
  res.status(200).send('Hello motherfuckers');
});

var board = null;

io.on('connection', function(socket){
	console.log('Nuevo cliente conectado ' + socket.handshake.address);

	socket.on('new-board', function(data){
		console.log("NEW BOARD!");
		board = socket;
	}).on('led-state', function(data){
		console.log('Estado del led: ' + data.state);
		io.sockets.emit('led-state', data);
	}).on('toggle-led', function(data){
		console.log('Invoke: toggle-led');
		if (board != null) {
			board.emit('toggle-led', {});
			console.log('Sended: toggle-led');
		}
	});

	socket.emit('is-board', {});

	if (board != null) {
		board.emit('get-led-state', {});
	}
});

var PORT = process.argv[2] || 8080;

server.listen(PORT, function() {
	console.log('Server runing on port: '+PORT);
});



