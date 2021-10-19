const Websocket = require('ws');
const mongoose = require('mongoose');
const uuid = require('uuid');
const db = mongoose.connection;
const BSON = require('bson');

//
var workerFarm = require('worker-farm');
var workers    = workerFarm(require.resolve('./commands/commandHandler.js'));
var ret        = 0;

// file imports
const configFile = require("./config.json")
const { Account, Upgrade, Computer, databaseInit, Network, databasePull } = require("./databaseSchemas.js")
var datasets, accountDataset, networkDataset, upgradeDataset, computerDataset;
//console.log(Account, Upgrade, Computer, databaseInit)

const port = 2332;

function genNodeName() {
	var greekChars = "alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omikron pi rho sigma tau upsilon phi chi psi omega".split(" ");
	var charList = "qwertyuiopasdfghjklzxcvbnm1234567890".split("");
	var totalNode = greekChars[Math.floor(Math.random() * greekChars.length)] + "_" +
	greekChars[Math.floor(Math.random() * greekChars.length)] + "_" + 
	charList[Math.floor(Math.random() * charList.length)] +
	charList[Math.floor(Math.random() * charList.length)] +
	charList[Math.floor(Math.random() * charList.length)] +
	charList[Math.floor(Math.random() * charList.length)] +
	charList[Math.floor(Math.random() * charList.length)] +
	charList[Math.floor(Math.random() * charList.length)];
	return totalNode;
}

//var clients: Array<object> = [];
var clients = [];
// change type later

// start db
const connectString = "mongodb+srv://" + configFile.username + ":" + configFile.password + "@" + configFile.hostname + "/hackerman"
//const connectString = 'mongodb://localhost/hackerman'
mongoose.connect(connectString, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log("DB connection established")
});
// end db establishment

databaseHandler()

// formerly the database block
async function databaseHandler() {
	await databaseInit();
	datasets = await databasePull(accountDataset, networkDataset, upgradeDataset, computerDataset);
	// there is NO REASON why you shouldn't've kept datasets. tearing it apart is kinda a shit idea. fix it whenever
	accountDataset = datasets.acct;
	networkDataset = datasets.netw;
	upgradeDataset = datasets.upgr;
	computerDataset = datasets.comp;
	//console.log("o" + accountDataset + networkDataset + upgradeDataset + computerDataset);
}

// begin server code
const wss = new Websocket.Server({ port: port })

wss.on('connection', (ws) => {
	// TODO seperate thread pushing DB progress every 30 minutes?
	console.log('\nConnection established\n');

	var clientId = uuid.v4();
	ws.id = clientId;
	ws.authed = false;
	ws.currentUser = "???";
	ws.currentComp = 0;
	// TODO connection chain
	ws.connectionChain = [];
	console.log(ws.id);
	clients.push(ws);
	console.log("Active Connections: " + clients.length);

	ws.on('message', async (message) => {
		console.log(ws.id + " (" + ws.currentUser + ")");
		// in case someone doesnt send json
		try {
			message = JSON.parse(message.toString());
		} catch {
			message = JSON.parse("{}");
		}

		// logging
		console.log('received: %s', message);
		console.log("Event Type: " + message.event);

		if (ws.authed != true) {
			if (message.event == "login") {
				// TODO CHANGE TO WORK WITH COPY IN MEMORY
				Account.findOne({username:message.data.username}, (err, res) => {
					if (err) {console.log(err);}
					if (res != null || res != undefined) {
						ws.authed = true;
						ws.currentUser = message.data.username;
						ws.send('{"event":"auth", "ok":true}');
						console.log("Found and successfully authenticated user " + res.username);
					} else {
						ws.authed = false;
						ws.currentUser = "???";
						ws.send('{"event":"auth", "ok":false}');
						console.log("Authentication failed for user " + message.data.username + ". User not found");
					}
					return res;
				});
			} else if (message.event == "disconnect" || message.event == "exit" || message.event == "logout") {
				//
				ws.authed = false;
				await ws.send('{"event":"exit", "ok":true, "msg":"Logout successful"}')
				ws.terminate();
				return;
			} else if (message.event == "register") {
				ws.send('{"event":"auth", "ok":false, "msg":"Registration is currently closed."}');
				// NEW DB SEARCH
				var found = false;
				console.log(accountDataset instanceof mongoose.Document);
				accountDataset.find((o, i) => {
					if (o.username == message.data.username) {
						found = true;
						ws.authed = false;
						ws.currentUser = "???";
						ws.send('{"event":"auth", "ok":false}');
						console.log("User " + message.data.username + " failed authentication (attempted register with existing account " + message.data.username + ")");
						//accountDataset[i].passwdHash = "shitters";
						return true; // stop searching
					}
				});
				if (!found) {
					var acctUUID = uuid.v4();
					var compUUID = uuid.v4();
					var registerAcct = new Account({id:acctUUID, username:message.data.username, passwdHash:message.data.password, network:"some_random_id", homeComp:3, creationDate:Date.now()});
					var registerComp = new Computer({id:compUUID, address:genNodeName(), balance:0, specs:{}, creationDate:Date.now()});
					// TODO PLEASE CHECK THOSE IDs ARENT TAKEN?? OR NOT THATS COOL TOO
					accountDataset.push(registerAcct);
					computerDataset.push(registerComp);
					console.log(accountDataset);

					ws.authed = true;
					ws.currentUser = message.data.username;
					ws.send('{"event":\"auth\", "ok":true}');
					console.log("Created and successfully authenticated user " + message.data.username);
					accountDataset[2].save(); // actually sobbing rn
				}
			} else {
				ws.send('{"event":"auth", "ok":false, "desc":"Unauthenticated user. Please log in to continue."}')
			}
		} else {
			if (message.event == "command") {
				console.log("Received command: " + message.data.cmd)
				var cmdParts = message.data.cmd.split(" ");
				// SANITIZE
				console.log(cmdParts);
				// uhhh more shit i think
				workers(cmdParts, accountDataset, networkDataset, upgradeDataset, computerDataset, ws, (err, out) => {console.log(out)});
				//workerFarm.end(workers);
			}
			else if (message.event == "exit" || message.event == "shutdown" || message.event == "reset" || message.event == "disconnect") {
				ws.authed = false;
				ws.send('{"event":"exit", "ok":true, "desc":"Logged out."}')
				console.log("Unauthenticated user " + ws.currentUser);
				ws.currentUser = "formerly " + ws.currentUser;
			}
		}
		console.log("");
	});

	ws.on('close', (data) => {
		console.log(ws.id);
		var targetIndex = -1;
		for (var v = 0; v < clients.length; v++) {
			var client = clients[v];

			if (client.id === ws.id)
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
  
	//ws.send('{"event":"test"}');
	console.log("");
});

wss.on('error', (err) => {
	console.log("CRITICAL ERROR\n" + err.toString());
	workerFarm.end(workers);
})

console.log(`Server listening on port ${port}`)