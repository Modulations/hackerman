const
    mongoose = require('mongoose'),
    uuid = require('uuid');

module.exports = new mongoose.Schema({
	id: {type:String, default:uuid.v4()},
	uid: String, // userID
	passwdHash: String,
	creationDate: { type: Date, default:Date.now() },
	ip: String
}, { minimize: false });
