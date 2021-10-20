function genNodeName() {
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

module.exports = { genNodeName };