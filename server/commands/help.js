module.exports = (datasets, ws, cmdParts) => {
    // TODO actual work
    // console.log("HELP")
    // return "No help available."
    var allCommands = [
["ls", "Lists the contents of your current directory."],
["connect", "Connects you to the target computer."],
["ip", "Lists the IP address of your current device."],
["hostname", "Lists the name of your current device."],
["test", "Tests something."],
["scan", "Scans all connections to and from this device. Requires administrative access."],
["help", "Shows this text."],
["chain", "Returns your current connection chain."],
["specs", "Lists the specifications of your current device."]
]
    for (var i = 0; i < allCommands.length; i++) {
        allCommands[i] = allCommands[i].join("\n\t")
    }
    return "=== Command List ===\n" + allCommands.join("\n\n")
};