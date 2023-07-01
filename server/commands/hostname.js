module.exports = (datasets, ws) => {
    // TODO actual work
    // console.log(datasets.comp)
    console.log(datasets.comp.filter(x => x.id == ws.context.currentComp))
    // return ws.context
    return "Connected to " + datasets.comp.filter(x => x.id == ws.context.currentComp)[0].name
};