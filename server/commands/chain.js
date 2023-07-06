const common = require('../util/database.js')

module.exports = (datasets, ws, cmdParts) => {
    // TODO actual work
    console.log(ws.context)
    console.log(ws.context.connectionChain)
    var cmdReturn = []
    for (var i = 0; i < ws.context.connectionChain.length; i++) {
        var handle = common.searchForDocumentByDynamicField(datasets, "comp", "id", ws.context.connectionChain[i])
        cmdReturn.push(handle.name + ": " + handle.address)
    }
    return cmdReturn
};