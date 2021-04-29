const Websocket = require('ws');
const mongoose = require('mongoose');
const uuid = require('uuid');
const db = mongoose.connection;
const BSON = require('bson');

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
	charList[Math.floor(Math.random() * charList.length)];
	return totalNode;
}

//var clients: Array<object> = [];
var clients: Array<any> = [];
// change type later

// start db
mongoose.connect('mongodb://localhost/hackerman', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log("DB connection established")
});
// end db establishment



//  | | | | | | | | \\
// start DB testing \\
//  | | | | | | | | \\

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const acctData = new Schema({
	id: { type: String },
	username: { type: String },
	passwdHash: { type: String },
	network: { type: String },
	homeComp: { type: String },
	creationDate: { type: Date }
});

const compData = new Schema({
	id: { type: String },
	address: { type: String },
	balance: { type: Number },
	specs: { type: Object },
	authUsers: { type: Array },
	breached: { type: Boolean },
	creationDate: { type: Date }
});

const upgData = new Schema({
	name: { type: String },
	type: { type: String },
	versionFrom: { type: String },
	versionTo: { type: String },
	tier: { type: Number },
	loaded: { type: Boolean },
	description: { type: String },
	index: { type: Number },
	location: { type: String },
	sn: { type: String },
	creationDate: { type: Date }
});

const Account = mongoose.model('account', acctData);
const Computer = mongoose.model('computer', compData);
const Upgrade = mongoose.model('upgrade', upgData);

var acctId: String = uuid.v4();
var compId: String = uuid.v4();
var upgrId: String = uuid.v4();

var newAcct = new Account({id:acctId, username:"root", passwdHash:"testHASH", network:"some_random_id", homeComp:compId, creationDate:Date.now()});
var newComp = new Computer({id:compId, address:"alpha_psi_w39xcd", balance:159178420, specs:{}, creationDate:Date.now()});
var newUpg = new Upgrade({name:"something_wrong_here_v1", type:"unknown", versionFrom:"0", versionTo:"100", tier:0, loaded:false, description:"I wanted you cause you stood out from the rest ## I wanted you cause you said you don’t belong here ## That you could find a better place ## But I think there’s something wrong here ##", index:0, location:"root", sn:upgrId, creationDate:Date.now()});

// THE FOLLOWING CODE BLOCKS:
// CHECK IF AN ACCOUNT/COMPUTER WITH THE SAME ID ALREADY EXISTS IN THE DB
// IF NOT, WRITE TO DB.
// IF SO, DO NOTHING.
Account.find({username:"root"}, (err: any, res: any) => {
	if (err) { console.log(err); }
	if (res[0] == null || res[0] == undefined) { // does it exist?
		newAcct.save((err: any) => { // save to db
			if (err) return console.error(err);
			console.log("Created new user " + newAcct.username);
		});
	}
	//console.log("User " + newAcct.username + " already exists.");
});

Computer.find({address:"alpha_psi_w39xcd"}, (err: any, res: any) => {
	if (err) { console.log(err); }
	if (res[0] == null || res[0] == undefined) { // does it exist?
		newComp.save((err: any) => { // save to db
			if (err) return console.log(err);
			console.log("Created new computer " + newComp.address);
		});
	}
	//console.log("Computer " + newComp.address + " already exists.");
});

Upgrade.find({name:"something_wrong_here_v1"}, (err: any, res: any) => {
	if (err) { console.log(err); }
	if (res[0] == null || res[0] == undefined) { // does it exist?
		newUpg.save((err: any) => { // save to db
			if (err) return console.log(err);
			console.log("Created new upgrade " + newUpg.name);
		});
	}
	//console.log("Upgrade " + newUpg.name + " already exists.");
});

//  | | | | | | | \\
// end DB testing \\
//  | | | | | | | \\

const wss = new Websocket.Server({ port: port })

wss.on('connection', (ws: any) => {
	console.log('\nConnection established\n');

	var clientId: string = uuid.v4();
	ws.id = clientId;
	ws.authed = false;
	ws.currentUser = "???";
	ws.currentComp = 0;
	console.log(ws.id);
	clients.push(ws);
	console.log("Active Connections: " + clients.length);

	ws.on('message', (message: any) => {
		console.log(ws.id + " (" + ws.currentUser + ")");
		message = JSON.parse(message.toString());
		console.log('received: %s', message);
		console.log("Event Type: " + message.event);
		if (message.event == "login") {
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
		}
		else if (message.event == "register") {
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
			Account.find({username:message.data.username}, (err: any, res: any) => {
				if (err) { console.log(err) }
				if (res[0] == null || res[0] == undefined) { // does it exist?
					newAcct.save((err: any) => { // save to db
						if (err) return console.error(err);
						console.log("Created new user " + newAcct.username);
					});
				}
			});
			
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
		else if (!ws.authed) {
			ws.send('{"event":"auth", "ok":false, "desc":"Unauthenticated user. Please log in to continue."}')
		}
		else if (message.event == "command") {
			console.log("Received command: " + message.data.cmd)
			var cmdParts: Array<String> = message.data.cmd.split(" ");
			console.log(cmdParts);
			// uhhh more shit i think
		}
		else if (message.event == "exit" || message.event == "shutdown" || message.event == "reset") {
			ws.authed = false;
			ws.send('{"event":"exit", "ok":true, "desc":"Logged out."}')
			console.log("Unauthenticated user " + ws.currentUser);
			ws.currentUser = "formerly " + ws.currentUser;
		}
		//ws.send('{"event":"test", "text":"Hello world.\nNewline!"}');
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
});

wss.on('error', (err : Error) => {
	console.log("CRITICAL ERROR\n" + err.toString());
})

console.log(`Server listening on port ${port}`)