const ws = new WebSocket('ws://localhost:2332');

export default {
    sendMessage: message => {
        ws.send(JSON.stringify(message));
    },
}

ws.onopen = e => {
    console.log('Websocket connected');
}

ws.onmessage = e => {
    console.log('received: %s', e.data);
}

ws.onclose = e => {
    console.log('You have been banned from the server.');
}