const lsCmd = require("./ls.js");
const connectCmd = require("./connect.js");

module.exports = (cmdParts, datasets, ws, callbackFunc) => {
    console.log('PID ' + process.pid + "\nHandling command: " + cmdParts.join(" ") + "");
    switch (cmdParts[0]) {
        // TODO make it return json objects
        default:
            callbackFunc(null, "Failure");
            break;
        case "ls":
            lsCmd();
            callbackFunc(null, "Listing...")
            break;
        case "connect":
            connectCmd();
            callbackFunc(null, "Connecting...")
            break;
    }
}
/*

== COMMANDS TO WRITE ==
-==- in some order -==-
    parentheses are aliases
    brackets are arguments
    questionmarks are questioning

connect [node_id]
    connects to a node. adds to chain
disconnect (dc)
    disconnects from a node. removes from chain

chain [destroy/abort] (d/a)
    returns the current connection chain. think of better cmdname
specs
    returns current system specs

files (ls?) [manage/install/uninstall] (m/i/u) [file_index]
    lists all upgrades
install [file_index] (?)
    alias for files -i
transfer (xfer/xf) [file_name]
    transfers upgrades. add COST.

fh (forcehack)
    admin command. pls do not deploy

drop [node_id]
    drop node from network. think more on it
catch [node_id] [password?]
    add node to network. think more on it

energy (list/transfer)
    think of better cmdname

# (#local?)
    preface command with this to run it locally? think.

re [node_index_in_chain]
    runs command on the node located at the given index in the connection chain


-- built-in software --
analyze (TYPE OF SOFTWARE FOR ANALYZING PORTS? IGNORE.)


-- tentative --
???

*/