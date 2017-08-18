var PORT = 19300;
var HOST = '127.0.0.1';
var mainServerIP = '127.0.0.1';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

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

	});

	server.bind(PORT, HOST);