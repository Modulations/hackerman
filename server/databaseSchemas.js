const mongoose = require('mongoose');
const uuid = require('uuid');
// TODO make sure this isn't dumb
const common = require("./common.js");

//  | | | | | | | | \\
// start DB testing \\
//  | | | | | | | | \\

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const acctData = new Schema({
	id: {type:String, default:uuid.v4()},
	username: String,
	passwdHash: String,
	network: String,
	homeComp: String,
	creationDate: { type: Date, default:Date.now() }
});

const compData = new Schema({
	id: {type:String, default:uuid.v4()},
	address: {type:String, default:common.genNodeName()},
	balance: {type: Number, default: 0},
	specs: {type:Object, default:{cpu:{name:"Shitter CPU", clockSpeed:2.4}, memory:{}, storage:256}},
	authUsers: {type: Object, default:{all:["welles"], fs:[], shell:[], memory:[]}},
	ports: {type:Object, default:{}},
	creationDate: {type: Date, default:Date.now()}
}, { minimize: false }); // lets me save empty obj to db :)

const upgData = new Schema({
	name: {type:String, default:"hollow_soft_v1"},
	type: {type:String, default:"software"},
	versionFrom: {type:Number, default:0.1},
	versionTo: {type:Number, default:0.1},
	components: {type:Object, default:{}},
	tier: {type:Number, default:0},
	loaded: {type:Boolean, default:false},
	description: {type:String, default:"a hollow (?) upgrade."},
	index: {type:Number, default:-1}, // TODO may be useless
	location: {type:String, default:"DEPRECATED"}, // TODO likely useless
	sn: {type:String, default:uuid.v4()},
	creationDate: { type: Date, default:Date.now() }
});

const networkData = new Schema({
	id: {type:String, default:uuid.v4()},
	name: String,
	kernel: String,
	compList: [String],
	creationDate: { type: Date, default:Date.now() }
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
var newNetw = new Network({name:"Proving Grounds", compList:[0], creationDate:Date.now()});

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

	await Network.find({name:"Proving Grounds"}, (err, result) => {
		if (err) { console.log(err); }
		if (result[0] == null || result[0] == undefined) { // does it exist?
			newNetw.save((err) => { // save to db
				if (err) return console.log(err);
				console.log("Created new network " + newNetw.name);
			});
		}
	})
}

async function databasePull(datasets) {
	datasets.acct = await Account.find({})
	datasets.netw = await Network.find({})
	datasets.upgr = await Upgrade.find({})
	datasets.comp = await Computer.find({})
	if (datasets.acct == undefined) { console.log("acct empty") } else { console.log("acct success") }
	if (datasets.netw == undefined) { console.log("netw empty") } else { console.log("netw success") }
	if (datasets.upgr == undefined) { console.log("upgr empty") } else { console.log("upgr success") }
	if (datasets.comp == undefined) { console.log("comp empty") } else { console.log("comp success") }
	// this can 100% be cleaned up
	return datasets;
}

//  | | | | | | | \\
// end DB testing \\
//  | | | | | | | \\

//export default { Account: Account, Computer: Computer, Upgrade: Upgrade, databaseInit: databaseInit }
module.exports = { Account: Account, Computer: Computer, Upgrade: Upgrade, databaseInit: databaseInit, Network: Network, databasePull: databasePull }