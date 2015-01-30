// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";
 
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat';

// Port where we'll run the websocket server
var webSocketsServerPort = 1337;
var webSocketsServerPort2 = 1338;
var yunIP='0.0.0.0'
var log=1;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
//var cors = require('cors')
/**
 * Global variables
 */
//light, pressure, temperature, sound
// latest 100 messages
var time=(new Date()).getTime()
time=1;
var sensors ={ "light":[{"value": 1, "time": time}],"pressure":[{"value": 1.1, "time": time}],"temperature":[{"value": 1.2, "time": time}],"sound":[{"value": 1.3, "time": time}]}


// list of currently connected clients (users)
var clients = [ ];
var clients2= [ ];
 
 
require('./ui');

 
/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
  //Here I implement the webserver API
  
  var url_tmp = request.url.toString().split('/'); 
  var url_array=url_tmp.filter(Boolean)
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
   if (url_array.length==1 && url_array[0]=="yunIP"){
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.end(JSON.stringify({"yunIP":yunIP}));
   }
  else if (url_array.length==3 && (url_array[0]=="control" && url_array[1]=="roomba" && (url_array[2]=="forward" ||  url_array[2]=="backward" || url_array[2]=="left" || url_array[2]=="right" || url_array[2]=="on" || url_array[2]=="off" )) ){
      console.log("Command:  "+url_array[1] +"  "+url_array[2]) 
      ///////////////////////////////////////////////////////////
      ///////////SEND THE COMMAND TO THE ARDUINO YUN/////////////
      ///////////////////////////////////////////////////////////
      for (var i=0; i < clients2.length; i++) {
        clients2[i].send(url_array[2]);
      }
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.end(JSON.stringify({"status":"command -"+url_array[2]+"- sent"}));

   }//endif
  else{
    response.writeHead(500, {'Content-Type': 'application/json'});
    response.end(JSON.stringify({"error":"not proper URL"}));
  }


});

var server2 = http.createServer(function(request, response) {
});

server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});
server2.listen(webSocketsServerPort2, function() {
    
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort2);
}); 


/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});

var wsServer2 = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server2
});

 
// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    if(log)console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    var connection = request.accept(null, request.origin); 
    // we need to know client index to remove them on 'close' event
    var index = clients.push(connection) - 1;
    if(log)console.log((new Date()) + ' Connection accepted form 1337');
    var json = JSON.stringify(sensors);
    // send back chat sensors
    if (sensors) {
        connection.sendUTF(json);
    }
    // user sent some message
    connection.on('message', function(message) {
        if (message.type === 'utf8') { // accept only text
                if(log)console.log((new Date()) + ' Received Message: ' + message.utf8Data);

 
                // broadcast message to all connected clients
                var json = JSON.stringify(sensors);
             for (var i=0; i < clients.length; i++) {
                clients[i].sendUTF(json);
             }
            //}//username
        }//if utf8
    });//on message
 
    // user disconnected
    connection.on('close', function(connection) {
        //if (userName !== false && userColor !== false) {
            if(log)console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected 1337.");
            // remove user from the list of connected clients
            clients.splice(index, 1);
            // push back user's color to be reused by another user
        //    colors.push(userColor);
        //}
    });
 
});


wsServer2.on('request', function(request) {
    if(log)console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    var connection = request.accept(null, request.origin); 
    // we need to know client index to remove them on 'close' event
    var index = clients2.push(connection) - 1;
    yunIP=((request.origin).split(':'))[0]
    if(log)console.log((new Date()) + ' Connection accepted.');
 
    // send back chat sensors
    //if (sensors.length > 0) {
    //    connection.sendUTF(JSON.stringify( { type: 'sensors', data: sensors} ));
    //}
    // user sent some message

    connection.on('message', function(message) {
      if (message.type === 'utf8' && (message.utf8Data).indexOf("IP")!=-1)
               yunIP=(message.utf8Data).replace('IP','');
      else  if (message.type === 'utf8') { // accept only text

                if(log)console.log((new Date()) + ' Received Message: ' + message.utf8Data);
                var msg_s=message.utf8Data
                var data_sensors=msg_s.split(',')
               // sensors = sensors.slice(-100);
 
                // broadcast message to all connected clients
		//format to a valid json
                //var time=(new Date()).getTime()
                //var sensors ={   "light":[{"value": 1, "time": time}],"pressure":[{"value": 1.1, "time": time}],"temperature":[{"value": 1.2, "time": time}],"sound":[{"value": 1.3, "time": time}]}
		time=(new Date()).getTime()
                //console.log (data_sensors[0])
                if(data_sensors[0] ){
                  sensors["light"][0].value=data_sensors[0]
		  sensors["light"][0].time=time
		}
                if(data_sensors[1]){
			sensors["pressure"][0].value=data_sensors[1]
			sensors["pressure"][0].time=time
		}
                if(data_sensors[2]){
			sensors["temperature"][0].value=data_sensors[2]
			sensors["temperature"][0].time=time
		}
                if(data_sensors[3]){
			sensors["sound"][0].value=data_sensors[3]
			sensors["sound"][0].time=time
		}
		//pardse
                var json = JSON.stringify(sensors);
                for (var i=0; i < clients.length; i++) {
                    clients[i].sendUTF(json);
                }
        }//if utf8
    });//on message

    // user disconnected
    connection.on('close', function(connection) {
            if(log)console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected from 1338.");
	    clients2.splice(index, 1);

    });
 
});



