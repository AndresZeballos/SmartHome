var host = window.location.host;

var socket = io.connect(host, {'forceNew':true});

socket.on('board-status', function(board){
	var html = board.components.map(function(component, index){
		return (`
			<div>
				<h3>${component.name}</h3>
				<div>Estado: <strong>${component.status}</strong></div>
				<div>Acción: <form onsubmit="${component.action}">
						<input type="submit" value="${component.actionName}">
					</form>
				</div>
			</div>
			`);
	}).join(' ');

	document.getElementById('board').innerHTML = html;
});


