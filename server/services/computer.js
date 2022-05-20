const { ComputerModel: Computer } = require('../models');
const uuid = require('uuid');

const genNodeName = () => {
	var greekChars = "alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omicron pi rho sigma tau upsilon phi chi psi omega".split(" ");
	var charList = "qwertyuiopasdfghjklzxcvbnm1234567890".split("");
	var totalNode = greekChars[Math.floor(Math.random() * greekChars.length)] + "_" +
	greekChars[Math.floor(Math.random() * greekChars.length)] + "_" + 
	charList[Math.floor(Math.random() * charList.length)] +
	charList[Math.floor(Math.random() * charList.length)] +
	charList[Math.floor(Math.random() * charList.length)] +
	charList[Math.floor(Math.random() * charList.length)] +
	charList[Math.floor(Math.random() * charList.length)] +
	charList[Math.floor(Math.random() * charList.length)];
	return totalNode;
}

const createComputer = () => {
    var compUUID = uuid.v4();
    var registerComp = new Computer({id:compUUID, address:genNodeName(), balance:0, specs:{}, creationDate:Date.now()});
	return registerComp;
}

const initializeInDatabase = async (newComp) => (
    Computer.find({}, (err, res) => {
		if (err) { console.log(err); }
		if (res[0] == null || res[0] == undefined) { // does it exist?
			newComp.save((err) => { // save to db
				if (err) return console.log(err);
				console.log("Created new computer " + newComp.address);
			});
		}
	})
)

module.exports = {
    createComputer,
    initializeInDatabase
}