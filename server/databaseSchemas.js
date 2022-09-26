const
	mongoose = require('mongoose'),
	uuid = require('uuid');

const {
	computerService: computerService,
	accountService: accountService,
	networkService: networkService,
	upgradeService: upgradeService,
	playerService: playerService
} = require("./services");

const {
	ComputerModel: Computer,
	AccountModel: Account,
	NetworkModel: Network,
	UpgradeModel: Upgrade,
	PlayerModel: Player
} = require("./models")

//  | | | | | | | | \\
// start DB testing \\
//  | | | | | | | | \\

compId = uuid.v4();
netwId = uuid.v4();
userId = uuid.v1();

var newAcct = new Account({username:"root", passwdHash:"deadbeef", network:"some_random_id", homeComp:compId});
var newComp = new Computer({id:compId, address:"alpha_psi_w39xcd", name:"Atlas Battlestation", balance:159178420, specs: {cpu:{name:"Shitter CPU", clockSpeed:2.4}, memory:{}, storage:256}, authUsers: {all:["atlas"], fs:[], shell:[], memory:[]}, ports: {}, creationDate:new Date(0)});
var newUpgr = new Upgrade({});
var newNetw = new Network({id:netwId, name:"Proving Grounds", compList:[[compId]]});
var newUser = new Player({id:userId, playerName:"root", uid:"0", passwdHash:"deadbeef", creationDate:Date.now(), ip:"0.0.0.0"});

async function databaseInit() {
	await accountService.initializeInDatabase(newAcct);
	await computerService.initializeInDatabase(newComp);
	await upgradeService.initializeInDatabase(newUpgr);
	await networkService.initializeInDatabase(newNetw);
	await playerService.initializeInDatabase(newUser);
}

async function databasePull(datasets) {
	datasets.acct = await Account.find({})
	datasets.netw = await Network.find({})
	datasets.upgr = await Upgrade.find({})
	datasets.comp = await Computer.find({})
	datasets.user = await Player.find({})
	if (datasets.acct.length == 0) { console.log("acct empty") } else { console.log("acct success") }
	if (datasets.netw.length == 0) { console.log("netw empty") } else { console.log("netw success") }
	if (datasets.upgr.length == 0) { console.log("upgr empty") } else { console.log("upgr success") }
	if (datasets.comp.length == 0) { console.log("comp empty") } else { console.log("comp success") }
	if (datasets.user.length == 0) { console.log("user empty") } else { console.log("user success") }
	// this can 100% be cleaned up
	return datasets;
}

function syncOrErr(path) {
	var failedOne;
	for (var i = 0; i < path.length; ++i) {
		failedOne = path[i];
		path[i].save((err, res) => {
			if (err) {
				console.log("Error saving to database.\nDetails below:\n");
				console.log(err);
				console.log("\n" + failedOne);
			} else {
				console.log(res);
			}
		});
	}
}

async function databaseSync(datasets) {
	syncOrErr(datasets.acct);
	syncOrErr(datasets.netw);
	syncOrErr(datasets.upgr);
	syncOrErr(datasets.comp); // TODO errors, but works. fix eventually
	syncOrErr(datasets.user);
}

//  | | | | | | | \\
// end DB testing \\
//  | | | | | | | \\

module.exports = { databaseInit: databaseInit, databasePull: databasePull, databaseSync: databaseSync }