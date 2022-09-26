const { NetworkModel: Network, ComputerModel: Computer } = require('../models');
const uuid = require('uuid');

const createNetwork = (netName = "Indexed", primComp) => {
    var networkUUID = uuid.v4();
	netName += " Network";
    var newNetwork = new Network({
		id:networkUUID,
		compList:[primComp],
		name:netName,
		creationDate:Date.now()});
    // TODO complete?
	return newNetwork;
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
    initializeInDatabase,
	createNetwork
}