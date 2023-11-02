const
	mongoose = require('mongoose'),
	uuid = require('uuid'),
	redis = require('redis');

const {
	computerService: computerService,
	accountService: accountService,
	networkService: networkService,
	upgradeService: upgradeService,
	playerService: playerService
} = require("./services");

const {
	ComputerModel: Computer,
	AccountModel: Account,
	NetworkModel: Network,
	UpgradeModel: Upgrade,
	PlayerModel: Player
} = require("./models")

//  | | | | | | | | \\
// start DB testing \\
//  | | | | | | | | \\

compId = uuid.v4();
netwId = uuid.v4();
userId = uuid.v1();

var newAcct = new Account({username:"root", passwdHash:"deadbeef", network:"some_random_id", homeComp:compId});
var newComp = new Computer({id:compId, address:"alpha_psi_w39xcd", name:"Atlas Battlestation", balance:159178420, specs: {cpu:{name:"Shitter CPU", clockSpeed:2.4}, memory:{}, storage:256}, authUsers: {all:["atlas"], fs:[], shell:[], memory:[]}, ports: {}, creationDate:new Date(0)});
var newUpgr = new Upgrade({});
var newNetw = new Network({id:netwId, name:"Proving Grounds", compList:[[compId]]});
var newUser = new Player({id:userId, playerName:"root", uid:"0", passwdHash:"deadbeef", creationDate:Date.now(), ip:"0.0.0.0"});

async function databaseInit() {
	await accountService.initializeInDatabase(newAcct);
	await computerService.initializeInDatabase(newComp);
	await upgradeService.initializeInDatabase(newUpgr);
	await networkService.initializeInDatabase(newNetw);
	await playerService.initializeInDatabase(newUser);
}

async function databasePull(datasets) {
	datasets.acct = await Account.find({})
	datasets.netw = await Network.find({})
	datasets.upgr = await Upgrade.find({})
	datasets.comp = await Computer.find({})
	datasets.user = await Player.find({})
	console.log(datasets.acct.length < 1 ? "acct empty" : "acct success")
	console.log(datasets.netw.length < 1 ? "netw empty" : "netw success")
	console.log(datasets.upgr.length < 1 ? "upgr empty" : "upgr success")
	console.log(datasets.comp.length < 1 ? "comp empty" : "comp success")
	console.log(datasets.user.length < 1 ? "user empty" : "user success")
	return datasets;
}

function syncOrErr(path) {
	var failedOne;
	for (var i = 0; i < path.length; ++i) {
		failedOne = path[i];
		path[i].save((err, res) => {
			if (err) {
				console.log("Error saving to database.\nDetails below:\n");
				console.log(err);
				console.log("\n" + failedOne);
			} else {
				console.log(res);
			}
		});
	}
}

async function databaseSync(datasets) {
	syncOrErr(datasets.acct);
	syncOrErr(datasets.netw);
	syncOrErr(datasets.upgr);
	syncOrErr(datasets.comp); // TODO errors, but works. fix eventually
	syncOrErr(datasets.user);
}

//  | | | | | | | \\
// end DB testing \\
//  | | | | | | | \\


async function redisHandler(ds, rc) {
	console.time("redis db populated in")
	//rc.del('acct-dataset:*')
	await ds['acct'].forEach(async function (item, i) {
		await rc.json.set(`acct-dataset:${i}`, '$', item)
	});
	
	/*await ds['netw'].forEach((item, i) => {
		rc.set(`netw-dataset:${i}`, JSON.stringify(item))
	});*/

	await ds['netw'].forEach(async function (item, i) {
		await rc.json.set(`netw-dataset:${i}`, '$', item)
	});

	await ds['comp'].forEach(async function (item, i) {
		await rc.json.set(`comp-dataset:${i}`, '$', item)
	});

	await ds['upgr'].forEach(async function (item, i) {
		await rc.json.set(`upgr-dataset:${i}`, '$', item)
	});

	await ds['user'].forEach(async function (item, i) {
		await rc.json.set(`user-dataset:${i}`, '$', item)
	});
	
	console.timeEnd("redis db populated in")
	// const value = await rc.get('acct-dataset');
	// console.log(value);
	// try making the index for accounts
	// /*
	await redisIndexer(rc);
	// var test = await rc.ft.search(`idx:acct-dataset`, '@username:(root)')
	// console.log(JSON.parse(JSON.stringify(test)).documents[0].value)
	// console.log(JSON.parse(JSON.stringify(test)))
	// */
}

async function redisIndexer(rc) {
	try {
		await rc.ft.DROPINDEX('idx:acct-dataset')
		await rc.ft.create('idx:acct-dataset', {
			'$.id': {
				type: redis.SchemaFieldTypes.TEXT,
				SORTABLE: true,
				AS: 'id'
			},
			'$.creationDate': {
				type: redis.SchemaFieldTypes.TEXT,
				AS: 'creationDate'
			},
			'$._id': {
				type: redis.SchemaFieldTypes.TEXT,
				AS: '_id'
			},
			'$.username': {
				type: redis.SchemaFieldTypes.TEXT,
				AS: 'username'
			},
			'$.passwdHash': {
				type: redis.SchemaFieldTypes.TEXT,
				AS: 'passwdHash'
			},
			'$.network': {
				type: redis.SchemaFieldTypes.TEXT,
				AS: 'network'
			},
			'$.homeComp': {
				type: redis.SchemaFieldTypes.TEXT,
				AS: 'homeComp'
			},
			'$__v': {
				type: redis.SchemaFieldTypes.NUMERIC,
				AS: '__v'
			}
		}, {
			ON: 'JSON',
			PREFIX: 'acct-dataset:'
		});
	} catch (e) {
		if (e.message === 'Index already exists') {
			console.log('acct index already exists');
		} else {
			// Something went wrong, perhaps RediSearch isn't installed...
			console.error(e);
			process.exit(1);
		}
	}

	try {
		await rc.ft.DROPINDEX('idx:comp-dataset')
		await rc.ft.create('idx:comp-dataset', {
			'$.id': {
				type: redis.SchemaFieldTypes.TAG,
				SORTABLE: true,
				AS: 'id'
			},
			'$.name': {
				type: redis.SchemaFieldTypes.TEXT,
				AS: 'name'
			},
			'$.balance': {
				type: redis.SchemaFieldTypes.NUMERIC,
				AS: 'balance'
			},
			'$.specs.cpu.name': {
				type: redis.SchemaFieldTypes.TEXT,
				AS: 'specs_cpu_name'
			},
			'$.specs.cpu.clockSpeed': {
				type: redis.SchemaFieldTypes.NUMERIC,
				AS: 'specs_cpu_clockSpeed'
			},
			// TODO FIX THIS IN MEMORY
			// '$.specs.memory': {
			// 	type: redis.SchemaFieldTypes.TAG,
			// 	AS: 'specs_memory'
			// },
			'$.specs.storage': {
				type: redis.SchemaFieldTypes.NUMERIC,
				AS: 'specs_storage'
			},
			'$.specs.tier': {
				type: redis.SchemaFieldTypes.NUMERIC,
				AS: 'specs_tier'
			},
			'$.authUsers.all': {
				type: redis.SchemaFieldTypes.TAG,
				AS: 'authUsers_all'
			},
			'$.authUsers.fs': {
				type: redis.SchemaFieldTypes.TAG,
				AS: 'authUsers_fs'
			},
			'$.authUsers.shell': {
				type: redis.SchemaFieldTypes.TAG,
				AS: 'authUsers_shell'
			},
			'$.authUsers.memory': {
				type: redis.SchemaFieldTypes.TAG,
				AS: 'authUsers_memory'
			},
			'$.creationDate': {
				type: redis.SchemaFieldTypes.TEXT,
				AS: 'creationDate'
			},
			'$._id': {
				type: redis.SchemaFieldTypes.TEXT,
				AS: '_id'
			},
			'$.address': {
				type: redis.SchemaFieldTypes.TEXT,
				AS: 'address'
			},
			'$.ports.*': {
				type: redis.SchemaFieldTypes.TEXT,
				AS: 'ports'
			},
			'$.__v': {
				type: redis.SchemaFieldTypes.NUMERIC,
				AS: '__v'
			}
		}, {
			ON: 'JSON',
			PREFIX: 'comp-dataset:'
		});
	} catch (e) {
		if (e.message === 'Index already exists') {
			console.log('comp index already exists');
		} else {
			// Something went wrong, perhaps RediSearch isn't installed...
			console.error(e);
			process.exit(1);
		}
	}

	try {
		await rc.ft.DROPINDEX('idx:context')
		await rc.ft.create('idx:context', {
			'$.id': {
				type: redis.SchemaFieldTypes.TAG,
				SORTABLE: true,
				AS: 'id'
			},
			'$.currentUser': {
				type: redis.SchemaFieldTypes.TEXT,
				AS: 'currentUser'
			},
			'$.currentComp': {
				type: redis.SchemaFieldTypes.TAG,
				AS: 'balance'
			},
			'$.connectionChain': {
				type: redis.SchemaFieldTypes.TAG,
				AS: 'specs_cpu_name'
			}
		}, {
			ON: 'JSON',
			PREFIX: 'context:'
		});
	} catch (e) {
		if (e.message === 'Index already exists') {
			console.log('context index already exists');
		} else {
			// Something went wrong, perhaps RediSearch isn't installed...
			console.error(e);
			process.exit(1);
		}
	}
}

module.exports = { databaseInit: databaseInit, databasePull: databasePull, databaseSync: databaseSync, redisHandler: redisHandler }