const ws = new WebSocket('ws://localhost:2332');

export default {
    sendMessage: message => {
        ws.send(JSON.stringify(message));
    },
    sendCommand: command => {
        ws.send(JSON.stringify({
            event: "command",
            data:{
                cmd:command
            }
        }));
    },
    onMessageRecieved: cb => {
        ws.onmessage = e => {
            console.log('received: %s', e.data);
            cb(e.data);
        }
    }
}

ws.onopen = e => {
    console.log('Websocket connected');
}

ws.onclose = e => {
    console.log('You have been banned from the server.');
}