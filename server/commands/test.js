module.exports = (datasets, ws, cmdParts) => {
    // TODO actual work
    if (cmdParts.length > 1) {
        console.log(datasets[cmdParts[1]])
        return "searching for " + cmdParts[1]
    }
    return ws.context
};