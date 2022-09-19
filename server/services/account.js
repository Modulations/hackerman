const { AccountModel: Account } = require('../models');
const uuid = require('uuid');


const createAccount = (username, passwd) => {
    var acctUUID = uuid.v4();
    var netwUUID = uuid.v4();
    var registerAcct = new Account({id:acctUUID, username, passwdHash:passwd, network:netwUUID, homeComp:99999999, creationDate:Date.now()});
	return registerAcct;
}

const doesAccountNameExist = (username) => (Account.exists({username}))

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

const registerUser = (websocket, usrname, ds) => { // ds = datasets
	var exists = doesAccountNameExist(usrname);
	if (exists) {
		websocket.send("User already exists."); // TODO professionalize
		console.log("Failed registration for user " + usrname);
	} else {
		ds.acct.push(accountService.createAccount());
		ds.comp.push(computerService.createComputer());

		websocket.authed = true;
		websocket.currentUser = usrname;
		websocket.send("{\"event\":\"auth\", \"ok\":true}");
		console.log("Created and successfully authenticated user " + usrname);
		ds.acct[2].save();
	}
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
	registerUser
}