const { AccountModel: Account } = require('../models');
const uuid = require('uuid');


const createAccount = (username, passwd) => {
    var acctUUID = uuid.v4();
    var netwUUID = uuid.v4();
    var registerAcct = new Account({id:acctUUID, username, passwdHash:passwd, network:netwUUID, homeComp:99999999, creationDate:Date.now()});
	return registerAcct;
}

const doesAccountNameExist = (username) => (Account.exists({username}))

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
    initializeInDatabase
}