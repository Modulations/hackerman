var net = require('net');
//const PORT = 1337;
const PORT = 2332;

function createUUID(){
   
    let dt = new Date().getTime()
    
    const uuid = 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (dt + Math.random()*16)%16 | 0
        dt = Math.floor(dt/16)
        return (c=='x' ? r :(r&0x3|0x8)).toString(16)
    })
    
    return uuid
}

var client = new net.Socket();
var storedID = createUUID();
client.connect(PORT, '127.0.0.1', function() {
	console.log('Connected');
	client.write('HI HELLO I AM 100% CONNECTED');
	/*client.write('CLIENT INIT | STORED ACCOUNT ID: ' + storedID);
    testObj = {"event":"auth", "clientid":storedID, data:{"username":"test", "password":"admin"}};
    client.write(Buffer.from(JSON.stringify(testObj)));
    testObj = {"event":"game", "clientid":storedID, data:{"cmd":"connect 127.0.0.1"}};
    client.write(Buffer.from(JSON.stringify(testObj)));*/
});

client.on('data', function(data) {
	console.log('Received: ' + data);
});

client.on('close', function() {
	console.log('Connection closed');
});