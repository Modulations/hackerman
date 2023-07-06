const common = require('../util/database.js')

module.exports = (datasets, ws, cmdParts) => {
    // TODO actual work
    if (cmdParts.length < 2) {
        return "Usage: connect [IP ADDRESS]"
    } else if (cmdParts.length >= 1) {
        console.log(ws.context)
        //var cmdReturn = common.searchForDocumentByID(datasets, "comp", {address:cmdParts[1]})
        var cmdReturn = common.searchForDocumentByDynamicField(datasets, "comp", "address", cmdParts[1])
        console.log(cmdReturn)
        console.log(cmdReturn != null)
        if (cmdReturn != null) {
            ws.context.connectionChain.push(cmdReturn.id) // not pushing, not sure why
            console.log(ws.context.connectionChain)
            console.log(ws.context)
        } else {
            return "Connection failed."
        }
        // return "searching for " + cmdParts[1]
        return cmdReturn;
    }
    return ws.context
};