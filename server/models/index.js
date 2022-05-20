const mongoose = require('mongoose');

module.exports = {
  CompModel: mongoose.model('Computer', require('./computer.js')),
  NetwModel: mongoose.model('Network', require('./network.js')),
  UpgrModel: mongoose.model('Upgrade', require('./upgrade.js')),
  AcctModel: mongoose.model('Account', require('./account.js')),
  UserModel: mongoose.model('User', require('./user.js'))
  // UserModel: mongoose.model('User', require('./user'))
}