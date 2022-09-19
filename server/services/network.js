const { NetworkModel: Network } = require('../models');
const uuid = require('uuid');

const createNetwork = () => {
    var networkUUID = uuid.v4();
    //var newUpgrade = new Computer({id:compUUID, address:genNodeName(), balance:0, specs:{}, creationDate:Date.now()});
    // TODO complete
	return false;
}

const initializeInDatabase = async (newNetw) => (
    Network.find({name:"Proving Grounds"}, (err, result) => {
		if (err) { console.log(err); }
		if (result[0] == null || result[0] == undefined) { // does it exist?
			newNetw.save((err) => { // save to db
				if (err) return console.log(err);
				console.log("Created new network " + newNetw.name);
			});
		}
	})
)

module.exports = {
    initializeInDatabase
}