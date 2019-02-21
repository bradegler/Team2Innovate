const fs = require('fs');
const path = require('path');
const webServer = require('./web-server.js');
const databaseConn = require('./dbaccess/database-conn.js');
const dbConfig = require('./config/dbconfig.js');

async function startup() {
	console.log('Starting application');
	try {
		console.log('Initializing database module');

		await databaseConn.initialize();
	} catch (err) {
		console.error(err);

		process.exit(1); // Non-zero failure code
	}
	try {
		console.log('Initializing web server module');

		await webServer.initialize();
	} catch (err) {
		console.error(err);

		process.exit(1); // Non-zero failure code
	}
}

startup();

async function shutdown(e) {
	let err = e;

	console.log('Shutting down');

	try {
		console.log('Closing web server module');

		await webServer.close();
	} catch (e) {
		console.log('Encountered error', e);

		err = err || e;
	}

	try {
		console.log('Closing database module');

		await database.close();
	} catch (err) {
		console.log('Encountered error', e);

		err = err || e;
	}

	console.log('Exiting process');

	if (err) {
		process.exit(1); // Non-zero failure code
	} else {
		process.exit(0);
	}
}


process.on('SIGTERM', () => {
	console.log('Received SIGTERM');

	shutdown();
});

process.on('SIGINT', () => {
	console.log('Received SIGINT');

	shutdown();
});

process.on('uncaughtException', err => {
	console.log('Uncaught exception');
	console.error(err);

	shutdown(err);
});
