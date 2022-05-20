const { PlayerModel: Player } = require('../models');
const uuid = require('uuid');


const createPlayer = (username, passwd) => {
    var playerUUID = uuid.v4();
    var playerEntry = new Account({id:acctUUID, username, passwdHash:passwd, network:netwUUID, homeComp:99999999, creationDate:Date.now()});
	return playerEntry;
}

const assignComputerToPlayer = () => {
    // TODO complete this
    return false;
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
    createPlayer,
    assignComputerToPlayer,
    initializeInDatabase
}