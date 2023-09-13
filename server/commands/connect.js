const common = require('../util/database.js')
const playerService = require('../services/player.js')

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
            console.log(ws.context.id)
            playerService.updateContextComp(ws.context.id, cmdReturn.id)
            ws.context.connectionChain.push(cmdReturn.id)
            playerService.updateContextChain(ws.context.id, ws.context.connectionChain)
        } else {
            return "Connection failed."
        }
        // return "searching for " + cmdParts[1]
        return cmdReturn;
    }
    return ws.context
};