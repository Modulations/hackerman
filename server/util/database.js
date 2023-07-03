const uuid = require('uuid');
const {
    ComputerModel: Computer,
    NetworkModel: Network,
    UpgradeModel: Upgrade,
    AccountModel: Account,
    PlayerModel: Player
} = require('../models');

// TODO complete

const saveDocumentToDB = (datasets, docType, doc, criteria = {}) => {
    return "Unimplemented";
    switch (docType) {
        case "comp":
            Computer.find(criteria, (err, res) => {
                if (err) { console.log(err); return err; }
                // TODO figure out if it's saved locally but not on the server, and vice versa. local copy takes priority
                if (res[0] == null || res[0] == undefined) { // it does not exist
                    // functionToRun();
                    datasets.comp.push(doc);
                }
            })
            break;
        case "netw":
            Network.find(criteria, (err, res) => {
                if (err) { console.log(err); return err; }
                if (res[0] == null || res[0] == undefined) {
                    //
                    datasets.netw.push(doc);
                }
            })
            break;
        case "upgr":
            Upgrade.find(criteria, (err, res) => {
                if (err) { console.log(err); return err; }
                if (res[0] == null || res[0] == undefined) {
                    //
                    datasets.upgr.push(doc);
                }
            })
            break;
        case "acct":
            Account.find(criteria, (err, res) => {
                if (err) { console.log(err); return err; }
                if (res[0] == null || res[0] == undefined) {
                    //
                    datasets.acct.push(doc);
                }
            })
            break;
        case "user":
            Player.find(criteria, (err, res) => {
                if (err) { console.log(err); return err; }
                if (res[0] == null || res[0] == undefined) {
                    //
                    datasets.docType.push(doc);
                }
            })
            break;
        default:
            break;
    }
}

const searchDBforDocument = (datasets, docType, criteria = {}) => {
    switch (docType) {
        case "comp":
            Computer.find(criteria, (err, res) => {
                if (err) { console.log(err); return err; }
                if (res[0] != null || res[0] != undefined) { // it does exist
                    return res;
                } else {
                    return null;
                }
            })
            break;
        case "netw":
            Network.find({}, (err, res) => {
                if (err) { console.log(err); return err; }
                if (res[0] != null || res[0] != undefined) {
                    return res;
                } else {
                    return null;
                }
            })
            break;
        case "upgr":
            Upgrade.find({}, (err, res) => {
                if (err) { console.log(err); return err; }
                if (res[0] != null || res[0] != undefined) {
                    return res;
                } else {
                    return null;
                }
            })
            break;
        case "acct":
            Account.find({}, (err, res) => {
                if (err) { console.log(err); return err; }
                if (res[0] != null || res[0] != undefined) {
                    return res;
                } else {
                    return null;
                }
            })
            break;
        case "user":
            Player.find({}, (err, res) => {
                if (err) { console.log(err); return err; }
                if (res[0] != null || res[0] != undefined) {
                    return res;
                } else {
                    return null;
                }
            })
            break;
        default:
            break;
    }
}

const searchForDocument = (datasets, docType, criteria = {}) => {
    switch (docType) {
        case "comp":
            // datasets.comp.filter((iterateComp) => {
            //     for (var i = 0; i < Object.keys(criteria); i++) {
            //         if (Object.keys(criteria)[i] in iterateComp) {
            //             console.log(iterateComp)
            //             console.log("ABOVE HAS")
            //         } else {
            //             console.log(iterateComp)
            //             continue;
            //         }
            //     }
            // });
            // TODO change how you deal w the db
            Object.fromEntries(Object.entries(criteria).filter(([key, value]) => { // Iterates over each key:val pair in the criteria
                // console.log(key)
                // console.log(value)
                datasets.comp.filter((i) => {
                    // console.log(i[key])
                    // console.log(value)
                    if (i[key] == value) {
                        console.log("TRUE HERE")
                        console.log(i)
                        console.log(i.id)
                        return i.id; // idk why it doesnt return properly
                    }
                });
            }))
            // Computer.find(criteria, (err, res) => {
            //     if (err) { console.log(err); return err; }
            //     if (res[0] != null || res[0] != undefined) { // it does exist
            //         return res;
            //     } else {
            //         return null;
            //     }
            // })
            break;
        case "netw":
            Network.find({}, (err, res) => {
                if (err) { console.log(err); return err; }
                if (res[0] != null || res[0] != undefined) {
                    return res;
                } else {
                    return null;
                }
            })
            break;
        case "upgr":
            Upgrade.find({}, (err, res) => {
                if (err) { console.log(err); return err; }
                if (res[0] != null || res[0] != undefined) {
                    return res;
                } else {
                    return null;
                }
            })
            break;
        case "acct":
            Account.find({}, (err, res) => {
                if (err) { console.log(err); return err; }
                if (res[0] != null || res[0] != undefined) {
                    return res;
                } else {
                    return null;
                }
            })
            break;
        case "user":
            Player.find({}, (err, res) => {
                if (err) { console.log(err); return err; }
                if (res[0] != null || res[0] != undefined) {
                    return res;
                } else {
                    return null;
                }
            })
            break;
        default:
            break;
    }
}

const deleteDocument = (datasets, docType, criteria = {}) => {}

const searchLocalForDocument = searchForDocument;

module.exports = {
    saveDocumentToDB,
    searchDBforDocument,
    searchLocalForDocument,
    searchForDocument,
    deleteDocument
}