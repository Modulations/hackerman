const
    mongoose = require('mongoose'),
    uuid = require('uuid');

module.exports = new mongoose.Schema({
	id: {type:String, default:uuid.v4()},
	address: {type:String, required:true},
	name: {type:String, default: ""},
	balance: {type: Number, default: 0},
	specs: {type:Object, default:{cpu:{name:"Unidentified CPU", clockSpeed:2.4}, memory:8, storage:256}},
	authUsers: {type: Object, default:{all:["atlas"], fs:[], shell:[], memory:[]}},
	ports: {type:Object, default:{}},
	creationDate: {type: Date, default:Date.now()}
}, { minimize: false });