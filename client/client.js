const WebSocket = require("ws");

const ws = new WebSocket('ws://localhost:2332', {perMessageDeflate:false});

function buildEvent(name, data={}) {
    return JSON.stringify({"event":name, "data":data})
}

ws.on('open', async () => {
    //ws.send('{"event":"shit"}');
    //ws.send(buildEvent("register", {"username":"risk", "password":"aaaaaaa"}));
    ws.send(buildEvent("login", {"username":"risk", "password":"aaaaaaa"}));
    
    await new Promise(resolve => setTimeout(resolve, 5000));

    //ws.send(buildEvent("disconnect"))
    ws.send(buildEvent("command", {"cmd":"ls"}))

    await new Promise(resolve => setTimeout(resolve, 3000));

    ws.terminate();
});

ws.on('message', (message) => {
    console.log('received: %s', message);
});

ws.on('close', (data) => {
    console.log(data);
})