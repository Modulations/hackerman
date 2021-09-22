const WebSocket = require("ws");

const ws = new WebSocket('ws://localhost:2332', {perMessageDeflate:false});

function buildEvent(name, data) {
    return JSON.stringify({"event":name, "data":data})
}

ws.on('open', () => {
    ws.send('{"event":"shit"}');
    ws.send(buildEvent("register", {"username":"shidpog", "password":"aaaaaaa"}));
    ws.send(buildEvent("login", {"username":"root", "password":"a"}));
});

ws.on('message', (message) => {
    console.log('received: %s', message);
});
