const common = require('../util/database.js')

module.exports = (datasets, ws, cmdParts) => {
    // TODO actual work
    if (cmdParts.length < 2) {
        return "Usage: connect [IP ADDRESS]"
    } else if (cmdParts.length >= 1) {
        console.log(ws.context)
        var cmdReturn = common.searchForDocument(datasets, "comp", {address:cmdParts[1]})
        // return "searching for " + cmdParts[1]
        return cmdReturn;
    } else if (cmdParts.length >= 2) {
        console.log(ws.context)
        return "searching for " + cmdParts[1]
    }
    return ws.context
};