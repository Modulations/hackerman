const mongoose = require('mongoose');

module.exports = {
    computerService: require("./computer.js"),
    networkService: require("./network.js"),
    upgradeService: require("./upgrade.js"),
    accountService: require("./account.js"),
    playerService: require("./player.js")
}