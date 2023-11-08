const { AccountModel: Account, ComputerModel: Computer } = require('../models');

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
const { safeSearch } = require('../util/common.js');


const createAccount = (username, passwd, netw) => {
    var acctUUID = uuid.v4();
    var netwUUID = uuid.v4();
	// TODO sync netwUUID and homeComp
    var registerAcct = new Account({id:acctUUID, username:username, passwdHash:passwd, network:netwUUID, homeComp:netw, creationDate:Date.now()});
	return registerAcct;
}

const doesAccountNameExist = (usrname) => {
	// TODO change to redis
	Account.exists({username:usrname}, (err, data) => {
		console.log(data);
		return data;
	});
}

const findAndAuthenticate = async (redisClient, websocket, usrname) => {
	// var res = await redisClient.ft.search(`idx:acct-dataset`, `@username:(${usrname})`)
	var res = await safeSearch(redisClient, 'idx:acct-dataset', 'username', usrname)
	console.log(res)
	// console.log(JSON.parse(JSON.stringify(res)).documents[0])
	// res = JSON.parse(JSON.stringify(res)).documents[0]
	// console.log(res)
	if (res != null || res != undefined) {
		websocket.authed = true;
		websocket.context.currentUser = usrname;
		playerService.updateContextUser(redisClient, websocket.id, usrname); // TODO redis update
		websocket.send('{"event":"auth", "ok":true}');
		console.log("Found and successfully authenticated user " + res.username);
		console.log(res)
		verifyAcctData(redisClient, websocket, res.homeComp);
	} else {
		websocket.authed = false;
		websocket.context.currentUser = null;
		playerService.updateContextUser(redisClient, websocket.id, null);
		websocket.send('{"event":"auth", "ok":false}');
		console.log("Authentication failed for user " + usrname + ". User not found");
	}
}

const verifyAcctData = async (redisClient, websocket, compId) => {
	// var res = await redisClient.ft.search(`idx:comp-dataset`, `@id:{${redis_sanitize(compId)}}`)
	var res = await safeSearch(redisClient, 'idx:comp-dataset', 'id', compId)
	// TODO fix
	// console.log(JSON.parse(JSON.stringify(res)).documents[0])
	// res = JSON.parse(JSON.stringify(res)).documents[0]
	console.log(res) // SHOULD JUST BE AN OBJECT!!!!!!
	if (res == null || res == undefined) { // PC does not exist
		console.log("Invalid home computer for user")
		var temporaryPC = computerService.createComputer();
		var compListLength = await redisClient.lLen('comp-dataset')
		console.log(compListLength)
		redisClient.json.set(`comp-dataset:${compListLength}`, '$', temporaryPC); // TODO test this.
		console.log("Created new computer " + temporaryPC.address);
		
		// TODO redis update
		// websocket.context.currentComp = temporaryPC.id
		// websocket.context.connectionChain.push(temporaryPC.id)
		playerService.updateContextComp(websocket.id, temporaryPC.id, redisClient)
		playerService.updateContextChain(websocket.id, websocket.context.connectionChain, redisClient)
		updateHomeComp(datasets, websocket, temporaryPC);
	} else { // Does EXIST
		// TODO F1X TH1S
		// websocket.context.currentComp = compId;
		// websocket.context.connectionChain.push(compId);
		playerService.updateContextComp(websocket.id, compId, redisClient)
		playerService.updateContextChain(websocket.id, websocket.context.connectionChain, redisClient)
	}
}

const updateHomeComp = (datasets, websocket, newPC) => {
	// TODO update local datasets when you save to db
	Account.findOne({username:websocket.context.currentUser}, (err, res) => {
		if (err) {console.log(err);}
		console.log(res) // should be the account record
		res.homeComp = newPC.id;
		res.save((err) => {
			if (err) return console.log(err);
			console.log("Updated record " + newPC.id);
		});
	});
}


const registerUser = (websocket, usrname, passwd, ds) => { // ds = datasets
	var exists = doesAccountNameExist(usrname);
	if (exists) {
		websocket.send("Error: User already exists.");
		console.log("Failed registration for user " + usrname);
	} else {
		var tempComp = computerService.createComputer();
		ds.comp.push(tempComp);
		var tempNetw = networkService.createNetwork(usrname, tempComp.id);
		ds.netw.push(tempNetw);
		ds.acct.push(createAccount(usrname, passwd, tempNetw.id));

		websocket.authed = true;
		websocket.context.currentUser = usrname;
		websocket.send("{\"event\":\"auth\", \"ok\":true}");
		console.log("Created and successfully authenticated user " + usrname);
		ds.acct[2].save();
	}
}

const logoutUser = (websocket) => {
	websocket.authed = false;
	websocket.context.currentUser = "???";
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
	updateHomeComp,
	verifyAcctData,
	logoutUser
}