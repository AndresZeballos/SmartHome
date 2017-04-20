import socketIo from 'socket.io-client';
import inquirer from 'inquirer';
import five from 'johnny-five';


let board = new five.Board();

let host = process.argv[2] || '127.0.0.1',
    port = process.argv[3] || 8080,
    io,
    led, led13, led10;

board.on('ready', () => {
  led = new five.Led(11);
  led13 = new five.Led(13);
  led10 = new five.Led(10);
  io = socketIo.connect(`http://${host}:${port}`);

  io.on('connect', () => {
    console.log(`Connected to ${host}`);
    io.emit('new-board', {});
    console.log('New board sended');
    io.emit('new-board-status', getBoardStatus());
    console.log('New board sended');
  });

  configureCallbacks(io);

  board.repl.inject({
    led,
    io, socketIo, host, port
  });
});

function getBoardStatus() {
  return { components : [
    {
      name: 'Led (Pin 10)',
      status: led10.isOn ? 'Prendido' : 'Apagado',
      action: "socket.emit('toggle-led10', {});return false;",
      actionName: led10.isOn ? 'Apagar' : 'Prender',
      messageName: 'toggle-led10',
      actionRun: function() { led10.toggle(); }
    },
    {
      name: 'Led (Pin 11)',
      status: led.isOn ? 'Prendido' : 'Apagado',
      action: "socket.emit('toggle-led', {});return false;",
      actionName: led.isOn ? 'Apagar' : 'Prender',
      messageName: 'toggle-led',
      actionRun: function() { led.toggle(); }
    },
    {
      name: 'Led (Pin 13)',
      status: led13.isOn ? 'Prendido' : 'Apagado',
      action: "socket.emit('toggle-led13', {});return false;",
      actionName: led13.isOn ? 'Apagar' : 'Prender',
      messageName: 'toggle-led13',
      actionRun: function() { led13.toggle(); }
    }
  ] };
}

function getBoardCallbackNames() {
  return getBoardStatus().components.map(function(a) { return a.messageName; });
}

function configureCallbacks(io) {
  var callbacks = getBoardStatus().components;
  for(var index in callbacks) {
    console.log('Config: ' + callbacks[index].messageName);
    (function(i) {
      io.on(callbacks[i].messageName, (data) => {
        console.log(callbacks[i].messageName + ' recieved');
        callbacks[i].actionRun();
        io.emit('new-board-status', getBoardStatus());
        console.log('New status sended');
      });
    })(index);
  }
}


