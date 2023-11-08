const { PlayerModel: Player } = require('../models');
const { redis_sanitize, safeSearch } = require('../util/common.js');
const uuid = require('uuid');
var context = {}

const makeContext = async (clientID, redisClient) => {
	var entry = {
		id: clientID,
		currentUser: null,
		currentComp: null,
		connectionChain: []
	}
	context[clientID] = entry;
	userContext = await redisClient.json.set(`context:${clientID}`, '$', entry)
	//console.log("made context:")
	//console.log(userContext) // returns "OK"
	return entry;
}

const updateContextUser = async (redisClient, clientID, newUser) => {
	// var res = await redisClient.ft.search(`idx:context`, `@id:{${common.redis_sanitize(clientID)}}`)
	var res = await safeSearch(redisClient, 'idx:context', 'id', clientID)
	console.log("updating context user")
	console.log(res)
	res.currentUser = newUser;
	await redisClient.json.set(`context:${clientID}`, '$', res)
	return res;
};
const updateContextComp = async (clientID, newComp, redisClient) => {
	// var res = await redisClient.ft.search(`idx:context`, `@id:{${common.redis_sanitize(clientID)}}`)
	var res = await safeSearch(redisClient, 'idx:context', 'id', clientID)
	res.currentComp = newComp;
	await redisClient.json.set(`context:${clientID}`, '$', res)
	return res;
};
const updateContextChain = async (clientID, newChain, redisClient) => {
	context[clientID].connectionChain = newChain;
	return context[clientID];
};
const getContext = async (clientID, redisClient) => {
	// var res = await redisClient.json.set(`context:${clientID}`, '$', entry)
	// var res = await redisClient.ft.search(`idx:context`, `@id:{${redis_sanitize(clientID)}}`)
	var res = await safeSearch(redisClient, 'idx:context', 'id', clientID)
	//console.log("getting context")
	//console.log(res)
	return res;
};

const createPlayer = async (username, passwd) => {
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