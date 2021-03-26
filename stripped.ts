var net = require('net');

const port = 2332;

var clients: Array<object> = [];

function createUUID(){ // thanks stackoverflow
   
    let dt = new Date().getTime()
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (dt + Math.random()*16)%16 | 0
        dt = Math.floor(dt/16)
        return (c=='x' ? r :(r&0x3|0x8)).toString(16)
    })
    
    return uuid
}

var server = net.createServer((socket: any) => {
	console.log('Connection established\r\n');

	var clientId: string = createUUID();
	// so connections have a unique identifier

	socket.id = clientId;
	console.log(socket.id);

	clients.push(socket);
	console.log("Active Connections: " + clients.length);


	/*

	heads up, for the sake of time
	the next two socket.on things are the same

	*/
	socket.on('end', () => {
		console.log(socket.id);
		// so i know who's doing what

		var targetIndex: number = -1;

		for (var v: number = 0; v < clients.length; v++) {
			var client: any = clients[v];

			if (client.id === socket.id)
				targetIndex = v;
		}
		// ^  find and
		// v  remove who left from the list of clients
		clients.splice(targetIndex, 1);

		console.log('client disconnected');
		console.log("Active Connections: " + clients.length);
	});
	
	socket.on('error', (data: any) => {
		if (data.code === "ECONNRESET") {
			console.log(socket.id);
			// so i know who's doing what

			var targetIndex: number = -1;

			for (var v: number = 0; v < clients.length; v++) {
				var client: any = clients[v];

				if (client.id === socket.id)
					targetIndex = v;
			}
			// ^  find and
			// v  remove who left from the list of clients
			clients.splice(targetIndex, 1);

			console.log("Client unexpectedly disconnected");
			console.log("Active Connections: " + clients.length);
		}
	});

	socket.on('data', (data: any) => {
		// TODO check if they're authenticated
		console.log(data.toString());
		// what'd they send

		socket.write('SERVER SAYS HI');
		// so i can see if they can read
		socket.pipe(socket);
		// i forget why this is here
	});
});

server.on('end', () => {
	console.log("pog") // placeholder
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

server.listen(port, '127.0.0.1');
console.log(`Server listening on port ${port}`)