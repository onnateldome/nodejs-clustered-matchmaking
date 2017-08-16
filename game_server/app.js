var PORT = 19200;
var HOST = '127.0.0.1';


var dgram = require('dgram');
var server = dgram.createSocket('udp4');
const cluster = require('cluster');

var db = require('./db.js');
const UUID = require('uuid/v4');

//db.select(2); //test db queri
//console.log('user login id ='+ db.login("onna", "test"));
//var playertestID = UUID();
//console.log(playertestID);

const numCPUs = require('os').cpus().length;

var players = [];
var miniServers = [];
var gameServers = [];
console.log("cpu core count:" + numCPUs);
console.log("main server started on port " + PORT);

function send(message, ip, port) {
	server.send(message, 0, message.length, port, ip, function (err, bytes) {
		if (err) throw err;
	});

}
/*
 db.isServerUp(function (err) {
    if (err) {
        // error handling code goes here
        console.log("ERROR : ", err);
    } else {
        // code to execute on data retrieval
        if (data != null) {
             
         
            console.log(data);
        } else {
            send(new Buffer('login failed!'), remote.address, remote.port);
        }
        console.log("result from db is : ", data);
    }
    
    });
    */
function getStats(id, ip, port) {

	db.getStats(id, function (err, data) {
		if (err) {
			// error handling code goes here
			console.log("ERROR : ", err);
		} else {
			// code to execute on data retrieval
			if (data != null) {
				console.log(data.victories + ' ' + data.defeats);
				send(new Buffer('stt ' + players.length + ' ' + data.victories + ' ' + data.defeats), ip, port);
				// list of the current loged in players
				//console.log(players);
			} else {
				send(new Buffer('login failed!'), remote.address, remote.port);
			}
			console.log("result from db is : ", data);
		}
	});


}

server.on('listening', function () {
	var address = server.address();
	console.log('UDP Server listening on ' + address.address + ":" + address.port);
});



server.on('message', function (message, remote) {
	console.log(remote.address + ':' + remote.port + ' - ' + message);
	var msg = message.toString().split(" ");

	if (msg[0] == "login") {
		if (msg.length == 3) {
			db.login(msg[1], msg[2], function (err, data) {
				if (err) {
					// error handling code goes here
					console.log("ERROR : ", err);
				} else {
					// code to execute on data retrieval
					if (data != null) {
						for (var i = 0; i < players.length; i++) {
							if (players[i].pID == data) {
								send(new Buffer('0'), players[i].ip, players[i].port);
								players.splice(i, 1);
							}
						}
						
						var s_id = UUID();

						players.push({
							pID: data, session_id: s_id, ip: remote.address, port: remote.port
						})
						//query db for player stats. data is player ID here						
						send(new Buffer('sid ' + s_id), remote.address, remote.port);

						getStats(data, remote.address, remote.port);
						// list of the current loged in players
						//console.log(players);
					} else {
						send(new Buffer('login failed!'), remote.address, remote.port);
					}
					console.log("result from db is : ", data);
				}
			});

		} else {
			send(new Buffer('login failed!'), remote.address, remote.port);
		}
	}
	if (msg[0].length == 36) {
		for (var i = 0; i < players.length; i++) {
			if (players[i].session_id == msg[0]) {
				
				if (msg[1] == 'who') {
					console.log(players);
				}

				if (msg[1] == 'test') {
					db.select(2);
				}

				if (msg[1] == "logout") {
					for (var i = 0; i < players.length; i++) {
						if (players[i].session_id == msg[0]) {
							players.splice(i, 1);
							send(new Buffer('0'), remote.address, remote.port);
						}
					}
				}



				if (msg[1] == 'ping') {
					isOnline = 0;
					if (msg[0] != null) {
						for (var i = 0; i < players.length; i++) {
							if (players[i].session_id == msg[0]) {
								isOnline = 1;
							}
						}
					}
					send(new Buffer(isOnline.toString()), remote.address, remote.port);
				}
			} 

		}
	}


	if (msg[0] == 'test') {
		db.select(2);
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