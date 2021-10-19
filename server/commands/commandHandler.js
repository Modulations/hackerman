var dbs = require("../databaseSchemas")
module.exports = (cmdParts, accountDataset, networkDataset, upgradeDataset, computerDataset, ws, callbackFunc) => {
    console.log('PID ' + process.pid + "\nHandling command: " + cmdParts.join(" ") + "");
    callbackFunc(null, 0)
}