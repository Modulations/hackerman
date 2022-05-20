const mongoose = require('mongoose');

module.exports = {
  ComputerModel: mongoose.model('Computer', require('./computer.js')),
  NetworkModel: mongoose.model('Network', require('./network.js')),
  UpgradeModel: mongoose.model('Upgrade', require('./upgrade.js')),
  AccountModel: mongoose.model('Account', require('./account.js')),
  PlayerModel: mongoose.model('Player', require('./player.js'))
}