const { AccountModel: Account } = require('../models');

// Tried to do the thing below, got circular dependency issues. just keep the requires.
/*
const {
	computerService: computerService,
	networkService: networkService,
	upgradeService: upgradeService,
	playerService: playerService
} = require("./services");
*/
const computerService = require("./computer.js");
const networkService = require("./network.js");
const upgradeService = require("./upgrade.js");
const playerService = require("./player.js");

const uuid = require('uuid');


const createAccount = (username, passwd) => {
    var acctUUID = uuid.v4();
    var netwUUID = uuid.v4();
    var registerAcct = new Account({id:acctUUID, username:username, passwdHash:passwd, network:netwUUID, homeComp:99999999, creationDate:Date.now()});
	return registerAcct;
}

const doesAccountNameExist = (usrname) => (Account.exists({username:usrname}))

const findAndAuthenticate = (websocket, usrname) => {
	Account.findOne({username:usrname}, (err, res) => {
	if (err) {console.log(err);}
	if (res != null || res != undefined) {
		websocket.authed = true;
		websocket.currentUser = usrname;
		websocket.send('{"event":"auth", "ok":true}');
		console.log("Found and successfully authenticated user " + res.username);
	} else {
		websocket.authed = false;
		websocket.currentUser = "???";
		websocket.send('{"event":"auth", "ok":false}');
		console.log("Authentication failed for user " + usrname + ". User not found");
	}
	return res;
	})
}

const registerUser = (websocket, usrname, passwd, ds) => { // ds = datasets
	var exists = doesAccountNameExist(usrname);
	if (exists) {
		websocket.send("User already exists."); // TODO rewrite
		console.log("Failed registration for user " + usrname);
	} else {
		ds.acct.push(createAccount(usrname, passwd));
		ds.comp.push(computerService.createComputer());
		ds.netw.push(networkService.createNetwork(usrname));

		websocket.authed = true;
		websocket.currentUser = usrname;
		websocket.send("{\"event\":\"auth\", \"ok\":true}");
		console.log("Created and successfully authenticated user " + usrname);
		ds.acct[2].save();
	}
}

const logoutUser = (websocket) => {
	websocket.authed = false;
	websocket.currentUser = "???";
}

const initializeInDatabase = async (newAcct) => (
    Account.find({}, (err, res) => {
		if (err) { console.log(err); }
		if (res[0] == null || res[0] == undefined) { // does it exist?
			newAcct.save((err) => { // save to db
				if (err) return console.error(err);
				console.log("Created new user " + newAcct.username);
			});
		}
	})
)

module.exports = {
    createAccount,
    doesAccountNameExist,
    initializeInDatabase,
	findAndAuthenticate,
	registerUser,
	logoutUser
}