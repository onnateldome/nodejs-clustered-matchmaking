var PORT = 19200;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');


var db = require('./db.js');
const UUID = require('uuid/v4');

//db.select(2); //test db queri
//console.log('user login id ='+ db.login("onna", "test"));
var playertestID = UUID();
console.log(playertestID);


var players = [];
var miniServers = [];
var gameServers = [];

console.log("main server started on port " + PORT);


server.on('listening', function () {
	var address = server.address();
	console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
	console.log(remote.address + ':' + remote.port + ' - ' + message);
		
		
	if (message == "login") {

		db.login("onna", "test",function (err, data) {
			if (err) {
				// error handling code goes here
				console.log("ERROR : ", err);   
			} else {
				// code to execute on data retrieval
				console.log("result from db is : ", data);
			}    
		});
	}

});

server.bind(PORT, HOST);

/*
server.on('connection', function (socket) {

	var playerID = UUID();



	socket.on('disconnect', function () {
		console.log('client disconected');
		delete players[thisPlayerId];
		socket.broadcast.emit('disconnected', { id: thisPlayerId });
	});


});
*/