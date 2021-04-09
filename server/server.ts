const Websocket = require('ws');
const mongoose = require('mongoose');
const db = mongoose.connection;

//const port = 1337
const port = 2332;

//var clients: Array<object> = [];
var clients: Array<any> = [];
// change type later

function createUUID(){
   
    let dt = new Date().getTime()
    
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (dt + Math.random()*16)%16 | 0
        dt = Math.floor(dt/16)
        return (c=='x' ? r :(r&0x3|0x8)).toString(16)
    })
    
    return uuid
}

/*type MySocket = Object | ISocket
interface ISocket {
	id: string;
}
*/

// start db
mongoose.connect('mongodb://localhost/hackerman', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log("DB connection established")
});
// end db

const wss = new Websocket.Server({ port: port })

wss.on('connection', (ws: any) => {
	console.log('\nConnection established\r\n');

	var clientId: string = createUUID();
	ws.id = clientId;
	console.log(ws.id);
	//console.log(ws)
	clients.push(ws);
	console.log("Active Connections: " + clients.length);

	ws.on('message', (message: any) => {
		console.log(ws.id);
		console.log('received: %s', message);
		ws.send('{"event":"test", "text":"Hello world.\nNewline!"}');
	});
	ws.on('close', (data: any) => {
		console.log(ws.id);
		// so i know who's doing what

		var targetIndex: number = -1;
		for (var v: number = 0; v < clients.length; v++) {
			var client: any = clients[v];

			if (client.id === ws.id)
				targetIndex = v;
		}
		// ^  find and
		// v  remove who left from the list of clients
		clients.splice(targetIndex, 1);

		console.log('client disconnected');
		if (data !== null) {
			console.log('data sent: ' + data);
		}
		console.log("Active Connections: " + clients.length);
	});
  
	//ws.send('{"event":"test"}');
});

wss.on('error', (err : Error) => {
	console.log("CRITICAL ERROR\n" + Error);
})

/*var server = net.createServer((socket: any) => {

	socket.on('end', () => {
		//
		// WARNING
		//
		// this code is untested
		// should work, probably won't
		//
		console.log(socket.id);

		var targetIndex: number = -1;

		for (var v: number = 0; v < clients.length; v++) {
			var client: any = clients[v];

			if (client.id === socket.id)
				targetIndex = v;
		}

		clients.splice(targetIndex, 1);

		console.log('client disconnected');
		console.log("Active Connections: " + clients.length);
	});
	
	socket.on('error', (data: any) => {
		console.log(data);
		//if (data.code === "ECONNRESET") {
			console.log(socket.id);

			var targetIndex: number = -1;

			for (var v: number = 0; v < clients.length; v++) {
				var client: any = clients[v];

				if (client.id === socket.id)
					targetIndex = v;
			}

			clients.splice(targetIndex, 1);

			console.log("Client unexpectedly disconnected");
			console.log("Active Connections: " + clients.length);
		//}
	});

	socket.on('data', (data: any) => {
		// check if they're authenticated
		console.log(data.toString());
		socket.write('SERVER SAYS HI');

		//socket.write("SERVER SAYS HI");

		if (false) { // example of sending data to other clients
			var testSocket: any = clients[0];
			testSocket.pipe(testSocket);
		}
		console.log();
	});
	socket.pipe(socket);
});

server.on('end', () => {
	console.log("pog")
})

server.on('error', (err: any) => {
	if (err.code === 'EADDRINUSE') {
		console.log('Address in use, retrying...');
		setTimeout(() => {
			server.close();
			server.listen(port, '127.0.0.1');
		}, 1000);
	}
	throw err;
})

server.listen(port, '127.0.0.1');*/
console.log(`Server listening on port ${port}`)