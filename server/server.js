const Websocket = require('ws');
const mongoose = require('mongoose');
const uuid = require('uuid');
const db = mongoose.connection;
const BSON = require('bson');
const redis = require('redis');

// services index
const {
	computerService: computerService,
	accountService: accountService,
	networkService: networkService,
	upgradeService: upgradeService,
	playerService: playerService
} = require("./services");

// file imports
const configFile = require("./config.json")

// redis setup
// has to come before workers
const redisClient = redis.createClient({ url: configFile.redisURL });
redisClient.connect('hackerman-redis');

// worker setup (WIP)
// TODO proper workers
var workerFarm = require('worker-farm');
var workers = workerFarm(require.resolve('./commands/commandHandler.js'));
var ret = 0;

const {
	databaseInit,
	databasePull,
	databaseSync,
	redisHandler
} = require("./databaseSchemas.js")

var datasets = {};

const port = 2332;

// list of clients! dont touch.
var clients = [];

// start db
const connectString = "mongodb+srv://" + configFile.username + ":" + configFile.password + "@" + configFile.hostname + "/hackerman"
mongoose.connect(connectString, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

db.on('error', () => {
	console.error.bind(console, 'connection error:')
	console.log('Check that the server is not frozen, and that this IP address is whitelisted.')
});
db.once('open', () => {
	console.log("DB connection established")
});
// end db establishment

// VERY IMPORTANT DO NOT TOUCH
async function databaseHandler() {
	await databaseInit();
	datasets = await databasePull(datasets);
	await redisHandler(datasets, redisClient);
}
redisClient.on('error', (err) => {console.log('Redis Client Error', err)})
databaseHandler();
// MAKE SURE CURRENT IP ADDRESS IS WHITELISTED
// DO NOT TOUCH ABOVE CODE

// begin server code
const wss = new Websocket.Server({ port: port })

wss.on('connection', (ws) => {
	// TODO seperate worker dedicated to pushing DB progress every 30 minutes?
	console.log('\nConnection established\n');

	ws.authed = false;
	// above should not be touched
	// TODO redis update
	var clientId = uuid.v4();
	playerService.makeContext(clientId, redisClient);
	ws.context = playerService.getContext(clientId, redisClient);
	ws.id = clientId
	// TODO remove ws.context refs throughout the whole game
	console.log(clientId);
	clients.push(ws);
	console.log("Active Connections: " + clients.length);

	ws.on('message', async (message) => {
		console.time(clientId);
		console.log(clientId + " (" + ws.context.currentUser + ")");
		// in case someone doesnt send json
		try {
			message = JSON.parse(message.toString());
		} catch {
			message = JSON.parse("{}");
		}

		// logging
		console.log('received: %s', message);
		console.log("Event Type: " + message.event);

		if (ws.authed != true) { // user not logged in
			if (message.event == "login") {
				accountService.findAndAuthenticate(redisClient, ws, message.data.username); // formerly returned true/false
			} else if (message.event == "register") {
				// ws.send('{"event":"auth", "ok":false, "msg":"Registration is currently closed."}');
				// ^ for closed alpha
				await accountService.registerUser(ws, message.data.username, message.data.password, datasets)
			} else if (message.event == "disconnect" || message.event == "exit" || message.event == "logout") {
				accountService.logoutUser(ws);
				ws.send('{"event":"exit", "ok":true, "msg":"Logout successful"}')
				ws.terminate();
				return;
			} else {
				ws.send('{"event":"auth", "ok":false, "desc":"Unauthenticated user. Please log in to continue."}')
			}
		}
		
		else { // user logged in
			if (message.event == "command") {
				console.log("Received command: " + message.data.cmd)
				var cmdParts = message.data.cmd.split(" ");
				// TODO SANITIZE
				console.log(cmdParts);
				workers(cmdParts, datasets, ws, (err, out) => {
					ws.send(out)
					ws.context = playerService.getContext(); // TEMPORARY
				});
				//workerFarm.end(workers);
			}
			else if (message.event == "logout") {
				ws.authed = false;
				ws.send('{"event":"exit", "ok":true, "desc":"Logged out."}');
				console.log("Unauthenticated user " + ws.context.currentUser);
				// ws.context.currentUser = "formerly " + ws.context.currentUser;
				playerService.updateContextUser(clientId, null)
			} else if (message.event == "sync") {
				await databaseSync(datasets);
				ws.send('{"event":"cmd", "ok":true}');
			}
		}
		console.timeEnd(clientId);
		console.log("");
	});

	ws.on('close', (data) => {
		console.log(clientId);
		var targetIndex = -1;
		for (var v = 0; v < clients.length; v++) {
			var client = clients[v];

			if (client.id === clientId)
				targetIndex = v;
		}
		// ^  find and
		// v  remove who left from the list of clients
		clients.splice(targetIndex, 1);

		console.log('client disconnected');
		if (data !== null) {
			try {
				console.log('data sent: ' + data);
			} catch {
				console.log('client returned unknown or corrupt data.')
			}
		}
		console.log("Active Connections: " + clients.length);
	});
	console.log("");
});

wss.on('error', (err) => {
	console.log("CRITICAL ERROR\n" + err.toString());
	workerFarm.end(workers);
})

console.log(`Server listening on port ${port}`);

// var gameLoopID = setInterval(gameLoop, 5000); // 5 seconds

function gameLoop() {
	// shitters
	console.log("saved game")
}