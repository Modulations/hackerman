const
    mongoose = require('mongoose'),
    uuid = require('uuid');

module.exports = new mongoose.Schema({
	name: {type:String, default:"hollow_soft_v1"},
	type: {type:String, default:"software"},
	versionFrom: {type:Number, default:0.1},
	versionTo: {type:Number, default:0.1},
	components: {type:Object, default:{}},
	tier: {type:Number, default:0},
	loaded: {type:Boolean, default:false},
	description: {type:String, default:"a hollow (?) upgrade."},
	index: {type:Number, default:-1}, // TODO may be useless
	location: {type:String, default:"DEPRECATED"}, // TODO likely useless
	sn: {type:String, default:uuid.v4()},
	creationDate: { type: Date, default:Date.now() }
}, { minimize: false });