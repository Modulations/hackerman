const
    mongoose = require('mongoose'),
    uuid = require('uuid');

module.exports = new mongoose.Schema({
	id: {type:String, default:uuid.v4()},
	username: String,
	passwdHash: String, // TODO remove
	network: String,
	homeComp: String,
	creationDate: { type: Date, default:Date.now() }
}, { minimize: false });