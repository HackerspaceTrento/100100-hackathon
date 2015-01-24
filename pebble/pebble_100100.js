/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ws = new WebSocket('ws://10.100.250.87:1337');
var Vector2 = require('vector2');
var ajax = require('ajax');

var wind = new UI.Window();
  var textfield = new UI.Text({
    position: new Vector2(0, 50),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Trento Hack Team!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();

var main = new UI.Card({
  title: 'Pebble.js',
  icon: 'images/menu_icon.png',
  subtitle: 'Hello 100100!',
  body: 'Wearable Interface!'
});



ws.onmessage = function (event) { 

    var card = new UI.Card();
    card.title('Sensor Data');
    console.log(event.data);
    
    var data = JSON.parse(event.data);
    var light = data.light[0].value;
    var pressure = data.pressure[0].value;
    var temperature = data.temperature[0].value;
    var sound = data.sound[0].value;
  
  
    card.body("L: "+light+", Pb: "+pressure+", T:"+temperature+", S:"+sound);
    card.show();
  
      card.on('click', 'up', function(e) {
      console.log("left");
      ajax({ url: 'http://10.100.250.87:1337/control/roomba/left'});
    });
    
    card.on('click', 'select', function(e) {
      console.log("forward");
      ajax({ url: 'http://10.100.250.87:1337/control/roomba/forward'});
      
    });
    
    card.on('click', 'down', function(e) {
      
      console.log("right");
      ajax({ url: 'http://10.100.250.87:1337/control/roomba/right'});
    });
    
    card.on('click', 'back', function(e) {
      console.log("backward");
      ajax({ url: 'http://10.100.250.87:1337/control/roomba/backward'});
      
    });
    
    card.on('longClick ', 'back', function(e) {
      console.log("exiting...");
      main.hide();  
    });
  
    
};

main.show();

main.on('click', 'up', function(e) {
  console.log("left");
  ajax({ url: 'http://10.100.250.87:1337/control/roomba/left'});
});

main.on('click', 'select', function(e) {
  console.log("forward");
  ajax({ url: 'http://10.100.250.87:1337/control/roomba/forward'});
  
});

main.on('click', 'down', function(e) {
  
  console.log("right");
  ajax({ url: 'http://10.100.250.87:1337/control/roomba/right'});
});

main.on('click', 'back', function(e) {
  console.log("backward");
  ajax({ url: 'http://10.100.250.87:1337/control/roomba/backward'});
  
});

main.on('longClick ', 'back', function(e) {
  console.log("exiting...");
  main.hide();  
});
