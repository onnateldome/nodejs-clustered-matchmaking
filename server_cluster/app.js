var PORT = 19400;
var HOST = '127.0.0.1';
var mainServerIP = '127.0.0.1';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

var session_id = '';

function send(message, ip, port) {
	server.send(message, 0, message.length, port, ip, function (err, bytes) {
		if (err) throw err;
	});
}


	server.on('listening', function () {
		var address = server.address();
		console.log('UDP Server listening on ' + address.address + ":" + address.port);
	});

	server.on('message', function (message, remote) {
		console.log(remote.address + ':' + remote.port + ' - ' + message);
		var msg = message.toString().split(" ");

		if (remote.address == mainServerIP) {

			
			if (msg[0] == 'sid') {
				session_id = msg[1];
			}

			if (msg[0] == 'cg') {
				var playerA = msg[1];
				var playerB = msg[2];
			}

		}
	});


	server.bind(PORT, HOST);