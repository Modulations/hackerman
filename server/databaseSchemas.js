const
	mongoose = require('mongoose'),
	uuid = require('uuid'),
	common = require("./common.js");

const {
	CompModel: Computer,
	AcctModel: Account,
	NetwModel: Network,
	UpgrModel: Upgrade,
	UserModel: User
} = require("./models")

//  | | | | | | | | \\
// start DB testing \\
//  | | | | | | | | \\

compId = uuid.v4();
netwId = uuid.v4();

var newAcct = new Account({username:"root", passwdHash:"deadbeef", network:"some_random_id", homeComp:compId});
var newComp = new Computer({id:compId, address:"alpha_psi_w39xcd", balance:159178420, creationDate:new Date(0)});
var newUpg  = new Upgrade({});
var newNetw = new Network({id:netwId, name:"Proving Grounds", compList:[[compId]]});

async function databaseInit() {
	// THE FOLLOWING CODE BLOCKS:
	// CHECK IF AN ACCOUNT/COMPUTER WITH THE SAME ID ALREADY EXISTS IN THE DB
	// IF NOT, WRITE TO DB.
	// IF SO, DO NOTHING.
	await Account.find({}, (err, res) => {
		if (err) { console.log(err); }
		if (res[0] == null || res[0] == undefined) { // does it exist?
			newAcct.save((err) => { // save to db
				if (err) return console.error(err);
				console.log("Created new user " + newAcct.username);
			});
		}
	});

	await Computer.find({}, (err, res) => {
		if (err) { console.log(err); }
		if (res[0] == null || res[0] == undefined) { // does it exist?
			newComp.save((err) => { // save to db
				if (err) return console.log(err);
				console.log("Created new computer " + newComp.address);
			});
		}
	});

	await Upgrade.find({}, (err, res) => {
		if (err) { console.log(err); }
		if (res[0] == null || res[0] == undefined) { // does it exist?
			newUpg.save((err) => { // save to db
				if (err) return console.log(err);
				console.log("Created new upgrade " + newUpg.name);
			});
		}
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
	datasets.user = await User.find({})
	if (datasets.acct == undefined) { console.log("acct empty") } else { console.log("acct success") }
	if (datasets.netw == undefined) { console.log("netw empty") } else { console.log("netw success") }
	if (datasets.upgr == undefined) { console.log("upgr empty") } else { console.log("upgr success") }
	if (datasets.comp == undefined) { console.log("comp empty") } else { console.log("comp success") }
	if (datasets.user == undefined) { console.log("user empty") } else { console.log("user success") }
	// this can 100% be cleaned up
	return datasets;
}

//  | | | | | | | \\
// end DB testing \\
//  | | | | | | | \\

//export default { Account: Account, Computer: Computer, Upgrade: Upgrade, databaseInit: databaseInit }
module.exports = { Account: Account, Computer: Computer, Upgrade: Upgrade, databaseInit: databaseInit, Network: Network, databasePull: databasePull }