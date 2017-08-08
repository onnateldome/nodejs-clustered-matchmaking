var PORT = 19200;
var HOST = '127.0.0.1';
var comm = '';
var user_id = '';
var user_name = '';
var session_id = '';

const readline = require('readline');
var dgram = require('dgram');
var client = dgram.createSocket('udp4');


client.on('listening', function () {
	console.log('UDP Server listening on ' + HOST + ":" + PORT);

});

client.on('message', function (message, remote) {
	console.log('\n' + HOST + ':' + PORT + ' - ' + message + '\n');
	var msg = message.toString().split(" ");
	if (msg[0] == '0') {
		console.log("LOST CONNECTION");
		session_id = '';
		user_id = '';
		user_name = '';
	}

	if (msg[0] == '1') {
		console.log("Pong!");
	}

	if (msg[0] == 'sid') {
		session_id = msg[1];
	}
});

function send(message) {
	client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
		if (err) throw err;		
	});

}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


function getcommand() {

	rl.question(user_id+' '+user_name+' '+session_id+'>', (r_command) => {

		var cm_send = '';
		cm_send = r_command.split(" ");
		if (cm_send[0] == 'quit') {
			process.exit();
		}
		console.log(`command sent: ${r_command}`);

		if (cm_send[0] == 'login') {
			send(new Buffer(r_command));
		}
		else if (r_command.length>0) {
			send(new Buffer(session_id+' '+r_command));
		}
		
	
		getcommand();
	});
}
getcommand();
