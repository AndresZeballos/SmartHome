var host = window.location.host;

var socket = io.connect(host, {'forceNew':true});

socket.on('led-state', function(data){
	console.log(data);
	renderState(data);
});

function renderState(data){
	var html = (`<div>El led está: <strong>${data.state}</strong></div>`);
	document.getElementById('led-state').innerHTML = html;
}

function toggleLed(e){
	socket.emit('toggle-led', {});
	return false;
}


