var readline = require('readline');
var WebSocket = require('ws');
var ws = new WebSocket('ws://10.100.250.87:1338/');
var os=require('os');


// create an interface to read lines from the console
var lineReader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
lineReader.on('line', function (data) {
	try {
	ws.send(data)
	} catch (e) {
	}
});

/*
Stop moving

1: Power ON (not needed, only after power off, just in case)
2: Move forward (1 second step)
3: Turn Right
4: Turn Left
5: Move backwards (1 second step)
10: Start cleaning process
*/
ws.on('open', function(data) {
	console.log("connected");
});
ws.on('message', function(message) {
	if (message=='forward') {
		console.log('2');
	} else if (message=='right') {
		console.log('3');
	} else if (message=='left') {
		console.log('4');
	} else if (message=='backward') {
		console.log('5');
	}
});

setTimeout(send, 3000); // start wait
function send(){
  ws.send('IP'+os.networkInterfaces()['wlan0'][0].address);
}
