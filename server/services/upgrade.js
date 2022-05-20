const { UpgradeModel: Upgrade } = require('../models');
const uuid = require('uuid');

const createUpgrade = () => {
    var upgradeUUID = uuid.v4();
    //var newUpgrade = new Computer({id:compUUID, address:genNodeName(), balance:0, specs:{}, creationDate:Date.now()});
    // TODO complete
	return false;
}

const initializeInDatabase = async (newUpgr) => (
    Upgrade.find({}, (err, res) => {
		if (err) { console.log(err); }
		if (res[0] == null || res[0] == undefined) { // does it exist?
			newUpgr.save((err) => { // save to db
				if (err) return console.log(err);
				console.log("Created new upgrade " + newUpgr.name);
			});
		}
	})
)

module.exports = {
    initializeInDatabase
}