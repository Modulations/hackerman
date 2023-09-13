module.exports = (datasets, ws) => {
    // TODO actual work
    // console.log(datasets.comp)
    // console.log(ws.context.currentComp)
    // console.log(datasets.comp.filter(x => x.id == ws.context.currentComp)) // find the current pc in the db
    var cc = datasets.comp.filter(x => x.id == ws.context.currentComp)[0]
    console.log(cc.specs)
    // return ws.context
    // return "Connected to " + ws.context.currentUser + "." + datasets.comp.filter(x => x.id == ws.context.currentComp)[0].address
    return cc.specs
};