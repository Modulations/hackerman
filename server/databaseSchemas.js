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

var newAcct = new Account({username:"root", passwdHash:"deadbeef", network:"some_random_id", homeComp:compId});
var newComp = new Computer({id:compId, address:"alpha_psi_w39xcd", balance:159178420, creationDate:new Date(0)});
var newUpgr = new Upgrade({});
var newNetw = new Network({id:netwId, name:"Proving Grounds", compList:[[compId]]});

async function databaseInit() {
	await accountService.initializeInDatabase(newAcct);
	await computerService.initializeInDatabase(newComp);
	await upgradeService.initializeInDatabase(newUpgr);
	await networkService.initializeInDatabase(newNetw);
}

async function databasePull(datasets) {
	datasets.acct = await Account.find({})
	datasets.netw = await Network.find({})
	datasets.upgr = await Upgrade.find({})
	datasets.comp = await Computer.find({})
	datasets.user = await Player.find({})
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

module.exports = { databaseInit: databaseInit, databasePull: databasePull }