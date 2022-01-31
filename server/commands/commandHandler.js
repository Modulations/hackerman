const lsCmd = require("./ls.js");
const connectCmd = require("./connect.js");

module.exports = (cmdParts, datasets, ws, callbackFunc) => {
    console.log('PID ' + process.pid + "\nHandling command: " + cmdParts.join(" ") + "");
    switch (cmdParts[0]) {
        // TODO make it return json objects
        default:
            callbackFunc(null, "Failure");
            break;
        case "ls":
            lsCmd();
            callbackFunc(null, "Listing...")
            break;
        case "connect":
            connectCmd();
            callbackFunc(null, "Connecting...")
            break;
    }
}