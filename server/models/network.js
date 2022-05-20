const
    mongoose = require('mongoose'),
    uuid = require('uuid');

module.exports = new mongoose.Schema({
	id: {type:String, default:uuid.v4()},
	name: String,
	kernel: String,
	compList: [],
	creationDate: { type: Date, default:Date.now() }
}, { minimize: false });