const { PlayerModel: Player } = require('../models');
const uuid = require('uuid');
var context = {}

const makeContext = (clientID) => {
	var entry = {
		id: clientID,
		currentUser: null,
		currentComp: null,
		connectionChain: []
	}
	context[clientID] = entry;
	console.log("words words words")
	console.log(context)
	return entry;
}

const updateContextUser = (clientID, newUser) => {
	context[clientID].currentUser = newUser;
	return context[clientID];
};
const updateContextComp = (clientID, newComp) => {
	console.log("cid below")
	console.log(clientID)
	console.log("con below")
	console.log(context)
	context[clientID].currentComp = newComp;
	return context[clientID];
};
const updateContextChain = (clientID, newChain) => {
	context[clientID].connectionChain = newChain;
	return context[clientID];
};
const getContext = (clientID) => {
	return context[clientID];
};

const createPlayer = (username, passwd) => {
    var playerUUID = uuid.v4();
    var playerEntry = new Account({id:acctUUID, username, passwdHash:passwd, network:netwUUID, homeComp:99999999, creationDate:Date.now()});
	return playerEntry;
}

const assignComputerToPlayer = () => {
    // TODO complete this
    return false;
}

const initializeInDatabase = async (newUser) => (
    Player.find({}, (err, res) => {
		if (err) { console.log(err); }
		if (res[0] == null || res[0] == undefined) { // does it exist?
			newUser.save((err) => { // save to db
				if (err) return console.error(err);
				console.log("Created new user " + newUser.username);
			});
		}
	})
)

module.exports = {
    createPlayer,
    assignComputerToPlayer,
    initializeInDatabase,
	makeContext,
	updateContextUser,
	updateContextComp,
	updateContextChain,
	getContext
}