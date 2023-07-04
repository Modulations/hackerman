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

const searchForDocumentByID = (datasets, docType, criteria) => {
    switch (docType) {
        case "comp":
            return datasets.comp.find(i => i.id == criteria);
            break;
        case "netw":
            return datasets.netw.find(i => i.id == criteria);
            break;
        case "upgr":
            return datasets.upgr.find(i => i.id == criteria);
            break;
        case "acct":
            return datasets.acct.find(i => i.id == criteria);
            break;
        case "user":
            return datasets.user.find(i => i.id == criteria);
            break;
        default:
            break;
    }
}

const searchForDocumentByDynamicField = (datasets, docType, dynamicField, criteria) => {
    // TODO you know what you can do here
    /*
    return datasets[docType].find(i => i[dynamicField] == criteria);
    */
    switch (docType) {
        case "comp":
            return datasets.comp.find(i => i[dynamicField] == criteria);
            break;
        case "netw":
            return datasets.netw.find(i => i[dynamicField] == criteria);
            break;
        case "upgr":
            return datasets.upgr.find(i => i[dynamicField] == criteria);
            break;
        case "acct":
            return datasets.acct.find(i => i[dynamicField] == criteria);
            break;
        case "user":
            return datasets.user.find(i => i[dynamicField] == criteria);
            break;
        default:
            break;
    }
}

const deleteDocument = (datasets, docType, criteria = {}) => {}

const searchForDocument = () => {};
const searchLocalForDocument = searchForDocument;

module.exports = {
    saveDocumentToDB,
    searchDBforDocument,
    searchLocalForDocument,
    searchForDocument,
    searchForDocumentByID,
    searchForDocumentByDynamicField,
    deleteDocument
}