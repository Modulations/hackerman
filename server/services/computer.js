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

const genCompName = () => {
	var prefixes = "Indexed  Unindexed  Unknown  Corporate  Sentient  Personal  Unidentified  Government";
	var suffixes = "Gateway  Battlestation  Asset Cache  Test Node  Workstation  Testbench  Storage  Server  PC  Personal Computer  Shell  Cluster  Dropserver  Honeypot  Mainframe  Cache  Home  Work  Proxy  Authentication  Laptop  Internal  Internal Services  Internal Cache  Internal  Router  Public Router  Public  Source  Repo Base  Virtual Environment  Virtual Machine".split("  ");
	var chosenPrefix = prefixes[Math.floor(Math.random() * prefixes.length)]
	var chosenSuffix = suffixes[Math.floor(Math.random() * suffixes.length)]
	if (Math.floor(Math.random() * 10000) == 1) {chosenSuffix = "Heart";}
	var fullName = chosenPrefix + " " + chosenSuffix;
	return fullName;
}

const createComputer = () => {
    var compUUID = uuid.v4();
    var registerComp = new Computer({id:compUUID, address:genNodeName(), name:genCompName(), balance:0, specs:{}, creationDate:Date.now()});
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
    initializeInDatabase,
	genNodeName,
	genCompName
}