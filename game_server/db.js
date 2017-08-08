var mysql = require('mysql');

var pool = mysql.createPool({
	connectionLimit: 100,
	host: 'testbed',
	user: 'root',
	password: '123asdqwe',
	database: 'GameDB',
	multipleStatements: true
	/*debug: true */
});

// log in check
exports.login = function (user, pass, callback) {
		pool.getConnection(function (err, connection) {
		if (err) {
			connection.release();
			callback(err, null);
		}
		//run the query
		connection.query('select ID from users where user_login="' + user+'" and user_pass="'+pass+'"', function (err, rows) {
			if (err) throw err;
			else {
				if (rows.length>0) {
					callback(null, rows[0].ID);
				} else {
					callback(null, null);}//	console.log(rows);
			}
		});

		connection.release();//release the connection
	});
};


// update game stats
exports.gameComplete = function () { };


// just a test
exports.select = function (uid) {


	pool.getConnection(function (err, connection) {
		if (err) {
			connection.release();
			throw err;
		}
		//run the query
		connection.query('select * from users where ID=' + uid, function (err, rows) {
			if (err) throw err;
			else {
				console.log(rows);
			}
		});

		connection.release();//release the connection
	});


};
