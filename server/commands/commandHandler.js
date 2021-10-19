var dbs = require("../databaseSchemas")
module.exports = (cmdParts, datasets, ws, callbackFunc) => {
    console.log('PID ' + process.pid + "\nHandling command: " + cmdParts.join(" ") + "");
    callbackFunc(null, 0)
}