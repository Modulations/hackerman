import { connect } from "http2";

const Websocket = require('ws');
const mongoose = require('mongoose');
const uuid = require('uuid');
const db = mongoose.connection;
const BSON = require('bson');

// file imports
const configFile = require("./config.json")
const { Account, Upgrade, Computer, databaseInit, Network, databasePull } = require("./databaseSchemas.js")
var datasets, accountDataset: Array<any>, networkDataset: object, upgradeDataset: object, computerDataset: object;
//console.log(Account, Upgrade, Computer, databaseInit)

//const port = 1337
const port = 2332;

function genNodeName() {
	var greekChars: Array<String> = "alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omikron pi rho sigma tau upsilon phi chi psi omega".split(" ");
	var charList: Array<String> = "qwertyuiopasdfghjklzxcvbnm1234567890".split("");
	var totalNode: String = greekChars[Math.floor(Math.random() * greekChars.length)] + "_" +
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
var clients: Array<any> = [];
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
	accountDataset = datasets.acct;
	networkDataset = datasets.netw;
	upgradeDataset = datasets.upgr;
	computerDataset = datasets.comp;
	console.log("o" + accountDataset + networkDataset + upgradeDataset + computerDataset);
}

// begin server code
const wss = new Websocket.Server({ port: port })

wss.on('connection', (ws: any) => {
	// TODO seperate thread pushing DB progress every 30 minutes?
	console.log('\nConnection established\n');

	var clientId: string = uuid.v4();
	ws.id = clientId;
	ws.authed = false;
	ws.currentUser = "???";
	ws.currentComp = 0;
	console.log(ws.id);
	clients.push(ws);
	console.log("Active Connections: " + clients.length);

	ws.on('message', async (message: any) => {
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
				Account.findOne({username:message.data.username}, (err: any, res: any) => {
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
				accountDataset.find((o, i) => {
					if (o.username == 'root') {
						accountDataset[i].passwdHash = "shitters";
						return true; // stop searching
					}
				});
				console.log(accountDataset);
				return;
				// TODO CHANGE TO WORK WITH COPY IN MEMORY
				Account.findOne({username:message.data.username}, (err: any, res: any) => { // user already exists
					if (err) {console.log(err)}
					if (res != null || res != undefined) { // whatever comes back IS NOT NULL OR UNDEFINED
						ws.authed = false;
						ws.currentUser = "???";
						ws.send('{"event":"auth", "ok":false}');
						console.log("User " + message.data.username + " failed authentication");
					}
					return res;
				});
				
				var acctId: String = uuid.v4();
				var compId: String = uuid.v4();

				var nodeName = genNodeName();
				var newAcct = new Account({id:acctId, username:message.data.username, passwdHash:message.data.password, network:"some_random_id", homeComp:compId, creationDate:Date.now()});
				var newComp = new Computer({id:compId, address:nodeName, balance:0, specs:{}, creationDate:Date.now()});
				// TODO CHANGE TO WORK WITH COPY IN MEMORY
				Account.find({username:message.data.username}, (err: any, res: any) => {
					if (err) { console.log(err) }
					if (res[0] == null || res[0] == undefined) { // does it exist?
						newAcct.save((err: any) => { // save to db
							if (err) return console.error(err);
							console.log("Created new user " + newAcct.username);
						});
					}
				});
				
				// TODO CHANGE TO WORK WITH COPY IN MEMORY
				Computer.find({address:nodeName}, (err: any, res: any) => {
					if (err) { console.log(err); }
					if (res[0] == null || res[0] == undefined) { // does it exist?
						newComp.save((err: any) => { // save to db
							if (err) return console.log(err);
							console.log("Created new computer " + newComp.address);
						});
					}
				});

				ws.authed = true;
				ws.currentUser = message.data.username;
				ws.send('{"event":\"auth\", "ok":true}');
				console.log("Created and successfully authenticated user " + message.data.username);
			}
			else {
				ws.send('{"event":"auth", "ok":false, "desc":"Unauthenticated user. Please log in to continue."}')
			}
		} else {
			if (message.event == "command") {
				console.log("Received command: " + message.data.cmd)
				var cmdParts: Array<String> = message.data.cmd.split(" ");
				console.log(cmdParts);
				// uhhh more shit i think
			}
			else if (message.event == "exit" || message.event == "shutdown" || message.event == "reset" || message.event == "disconnect") {
				ws.authed = false;
				ws.send('{"event":"exit", "ok":true, "desc":"Logged out."}')
				console.log("Unauthenticated user " + ws.currentUser);
				ws.currentUser = "formerly " + ws.currentUser;
			}
		}
	});

	ws.on('close', (data: any) => {
		console.log(ws.id);
		var targetIndex: number = -1;
		for (var v: number = 0; v < clients.length; v++) {
			var client: any = clients[v];

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

wss.on('error', (err : Error) => {
	console.log("CRITICAL ERROR\n" + err.toString());
})

console.log(`Server listening on port ${port}`)