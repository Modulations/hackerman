const mongoose = require('mongoose');
const uuid = require('uuid');

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

const networkData = new Schema({
	name: { type: String }
});

// these are all models
const Account = mongoose.model('account', acctData);
const Computer = mongoose.model('computer', compData);
const Upgrade = mongoose.model('upgrade', upgData);
const Network = mongoose.model('network', upgData);

var acctId = uuid.v4();
var compId = uuid.v4();
var upgrId = uuid.v4();
var netwId = uuid.v4();

var newAcct = new Account({id:acctId, username:"root", passwdHash:"testHASH", network:"some_random_id", homeComp:compId, creationDate:Date.now()});
var newComp = new Computer({id:compId, address:"alpha_psi_w39xcd", balance:159178420, specs:{}, creationDate:Date.now()});
var newUpg  = new Upgrade({name:"generic_upgrade", type:"unknown", versionFrom:"0", versionTo:"100", tier:0, loaded:false, description:"pog", index:0, location:"root", sn:upgrId, creationDate:Date.now()});
var newNetw = new Network({name:"eth0"});

async function databaseInit() {
	// THE FOLLOWING CODE BLOCKS:
	// CHECK IF AN ACCOUNT/COMPUTER WITH THE SAME ID ALREADY EXISTS IN THE DB
	// IF NOT, WRITE TO DB.
	// IF SO, DO NOTHING.
	await Account.find({username:"root"}, (err, res) => {
		if (err) { console.log(err); }
		if (res[0] == null || res[0] == undefined) { // does it exist?
			newAcct.save((err) => { // save to db
				if (err) return console.error(err);
				console.log("Created new user " + newAcct.username);
			});
		}
		//console.log("User " + newAcct.username + " already exists.");
	});

	await Computer.find({address:"alpha_psi_w39xcd"}, (err, res) => {
		if (err) { console.log(err); }
		if (res[0] == null || res[0] == undefined) { // does it exist?
			newComp.save((err) => { // save to db
				if (err) return console.log(err);
				console.log("Created new computer " + newComp.address);
			});
		}
		//console.log("Computer " + newComp.address + " already exists.");
	});

	await Upgrade.find({name:"generic_upgrade"}, (err, res) => {
		if (err) { console.log(err); }
		if (res[0] == null || res[0] == undefined) { // does it exist?
			newUpg.save((err) => { // save to db
				if (err) return console.log(err);
				console.log("Created new upgrade " + newUpg.name);
			});
		}
		//console.log("Upgrade " + newUpg.name + " already exists.");
	});

	await Network.find({name:"eth0"}, (err, result) => {
		if (err) { console.log(err); }
		if (result[0] == null || result[0] == undefined) { // does it exist?
			newNetw.save((err) => { // save to db
				if (err) return console.log(err);
				console.log("Created new network " + newNetw.name);
			});
		}
	})
}

async function databasePull(acctData, netwData, upgrData, compData) {
	acctData = await Account.find({})
	netwData = await Network.find({})
	upgrData = await Upgrade.find({})
	compData = await Computer.find({})
	if (acctData == undefined) { console.log("acct empty") } else { console.log("acct success") }
	if (netwData == undefined) { console.log("netw empty") } else { console.log("netw success") }
	if (upgrData == undefined) { console.log("upgr empty") } else { console.log("upgr success") }
	if (compData == undefined) { console.log("comp empty") } else { console.log("comp success") }
	return { "acct":acctData, "netw":netwData, "upgr":upgrData, "comp":compData };
}

//  | | | | | | | \\
// end DB testing \\
//  | | | | | | | \\

//export default { Account: Account, Computer: Computer, Upgrade: Upgrade, databaseInit: databaseInit }
module.exports = { Account: Account, Computer: Computer, Upgrade: Upgrade, databaseInit: databaseInit, Network: Network, databasePull: databasePull }