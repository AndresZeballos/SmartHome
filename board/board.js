import socketIo from 'socket.io-client';
import inquirer from 'inquirer';
import five from 'johnny-five';


let board = new five.Board();

let host = process.argv[2] || '127.0.0.1',
    port = process.argv[3] || 8080,
    io,
    led;

board.on('ready', () => {
  led = new five.Led(11);
  io = socketIo.connect(`http://${host}:${port}`);

  io.on('connect', () => {
    console.log(`Connected to ${host}`);
    io.emit('new-board', {});
    console.log('New board sended');
    io.emit('new-board-status', getBoardStatus());
    console.log('New board sended');

  });
  io.on('toggle-led', (data) => {
    console.log('Toggle recieved');
    led.toggle();
    io.emit('new-board-status', getBoardStatus());
    console.log('New board sended');
  });

  board.repl.inject({
    led,
    io, socketIo, host, port
  });
});

function getBoardStatus() {
  return { components : [
      {
        name: 'Led (Pin 11)',
        status: led.isOn ? 'Prendido' : 'Apagado',
        action: "socket.emit('toggle-led', {});return false;",
        actionName: led.isOn ? 'Apagar' : 'Prender'
      }
    ] };
}




