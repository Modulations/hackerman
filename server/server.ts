const Websocket = require('ws');
const mongoose = require('mongoose');
const uuid = require('uuid');
const db = mongoose.connection;
const BSON = require('bson');

//const port = 1337
const port = 2332;

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
	fsId: { type: String },
	balance: { type: Number },
	specs: { type: Object },
	authUsers: { type: Array },
	breached: { type: Boolean },
	creationDate: { type: Date }
});

const upgData = new Schema({
	name: { type: String },
	type: { type: String },
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
const Upgrade = mongoose.model('upgrade', compData);

var newAcct = new Account({id:"RANDOMPCIDENTIFIER", username:"root", passwdHash:"testHASH", network:"some_random_id", homeComp:"SoMeRaNdOmId", creationDate:Date.now()});
var newComp = new Computer({id:"RANDOMCOMPUTERIDENTIFIER", address:"alpha_psi_w39xcd", fsId:"someOTHERrandomID", balance:159178420, specs:{}, creationDate:Date.now()});
var newUpg = new Upgrade({creationDate:Date.now()});

var idToSearch: String = "RANDOMPCIDENTIFIER";
var otherIdToSearch: String = "RANDOMCOMPUTERIDENTIFIER";

// THE FOLLOWING CODE BLOCKS:
// CHECK IF AN ACCOUNT/COMPUTER WITH THE SAME ID ALREADY EXISTS IN THE DB
// IF NOT, WRITE TO DB.
// IF SO, DO NOTHING.
Account.find({id:idToSearch}, (err: any, res: any) => {
	if (err) { console.log(err); }
	if (res[0] == null || res[0] == undefined) { // does it exist?
		newAcct.save((err: any) => { // save to db
			if (err) return console.error(err);
			console.log("Created new user " + newAcct.username);
		});
	}
	console.log("User " + newAcct.username + " already exists.");
});

Computer.find({id:otherIdToSearch}, (err: any, res: any) => {
	if (err) { console.log(err); }
	if (res[0] == null || res[0] == undefined) { // does it exist?
		newComp.save((err: any) => { // save to db
			if (err) return console.log(err);
			console.log("Created new computer " + newComp.address);
		});
	}
	console.log("Computer " + newComp.address + " already exists.");
});

//  | | | | | | | \\
// end DB testing \\
//  | | | | | | | \\

const wss = new Websocket.Server({ port: port })

wss.on('connection', (ws: any) => {
	console.log('\nConnection established\r\n');

	var clientId: string = uuid.v4();
	ws.id = clientId;
	console.log(ws.id);
	clients.push(ws);
	console.log("Active Connections: " + clients.length);

	ws.on('message', (message: any) => {
		console.log(ws.id);
		message = JSON.parse(message.toString());
		console.log('received: %s', message);
		console.log(message.event);
		if (message.event == "login") {
			Account.findOne({username:message.data.username}, (err: any, res: any) => {
				if (err) {console.log(err);}
				ws.send('{"event":\"auth\"}');
				return res;
			});
		}
		ws.send('{"event":"test", "text":"Hello world.\nNewline!"}');
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
	console.log("CRITICAL ERROR\n" + Error.toString());
})

console.log(`Server listening on port ${port}`)