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
var callbacks = null;

io.on('connection', function(socket){
	console.log('Nuevo cliente conectado ' + socket.handshake.address);

	socket.on('new-board', function(data){
		console.log("NEW BOARD! " + socket.id);
		board = socket;
	}).on('new-board-status', function(data){
		boardStatus = data;
		callbacks = data.components.map(function(a) { return a.messageName; });
		io.sockets.emit('board-status', data);
		console.log(JSON.parse(JSON.stringify(data)));
	});

	configureCallbacks(socket);

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

function configureCallbacks(socket) {
	if (callbacks !== null) {
		for(var index in callbacks) {
			console.log('Config: ' + callbacks[index]);
			(function(i) {
				socket.on(callbacks[i], function(data){
					var aux = 'Invoke';
					if (board != null) {
						board.emit(callbacks[i], {});
						aux += ' and Sended';
					}
					console.log(aux + ': ' + callbacks[i]);
				});
	  		})(index);
		}
	}
}


