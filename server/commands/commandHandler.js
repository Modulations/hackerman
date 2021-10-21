const ls = require("./ls.js");

module.exports = (cmdParts, datasets, ws, callbackFunc) => {
    console.log('PID ' + process.pid + "\nHandling command: " + cmdParts.join(" ") + "");
    switch (cmdParts[0]) {
        // TODO make it return json objects
        default:
            callbackFunc(null, "Failure");
            break;
        case "ls":
            ls();
            callbackFunc(null, "shitter")
            break;
    }
}