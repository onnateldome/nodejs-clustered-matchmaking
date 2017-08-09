var db = require('./db.js');

const UUID = require('uuid/v4');

exports.user_login = function (user,pass,ip,port) {

	db.login(user, pass, function (err, data) {
		if (err) {
			// error handling code goes here
			console.log("ERROR : ", err);
			return null;
		} else {
			// code to execute on data retrieval
			if (data != null) {
				var s_id = UUID();
				
				//query db for player stats. data is player ID here
				//	db.getStats(data, function (err, p_stats)

				//send(new Buffer('sid ' + s_id + ' ' + players.length+' '+ ), remote.address, remote.port);
				// list of the current loged in players
				var player = { pID: data, session_id: s_id, ip: ip, port: port };
				return player;
			} else {
				return null;
			}
			console.log("result from db is : ", data);
		}
	});

}