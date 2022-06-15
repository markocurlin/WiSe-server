const express = require('express');
const router = express.Router();
const app = express();
var server = require("http").Server(app); 
var io = require("socket.io")(server); 
server.listen(process.env.PORT || 3000, () => { 
   console.log('listening on *:3000');
});

// MQTT setup
var mqtt = require('mqtt');
var options = {
    port: 1883,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'pametni-vrt@ttn',
    password: 'NNSXS.MP5RQFQEUEMNB2KEIKCYKMVIAUUSNTEERO44MPY.F3QC2BG5FRBQ5EZNPFODB36PU3Z4W5CV3T5F3EEPZIRFCNBAX65Q',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};

var client = mqtt.connect('https://eu1.cloud.thethings.network',options);

// Global variable to save data
var globalMQTT = 0;

// SOCKET
io.on("connection", function(socket)
{
  console.log("Client connected: " + socket.id);

  socket.on("disconnect", function() {
    console.log(socket.id + " disconnected");
  });

  socket.on("REQUEST_GET_DATA", function() {
    socket.emit("SEND_DATA",globalMQTT);
  });

  function intervalFunc() {
    socket.emit("SEND_DATA", globalMQTT);
  }
  setInterval(intervalFunc, 2000);
});

// MQTT setup
client.on('connect', function() {
  console.log('Client connected to TTN')
  client.subscribe('#')
});

client.on('error', function(err) {
  console.log(err);
});

client.on('message', function(topic, message) {
  var getDataFromTTN = JSON.parse(message);
  console.log("Data from TTN: ", getDataFromTTN.uplink_message.frm_payload);
  var getFrmPayload = getDataFromTTN.uplink_message.frm_payload;
  globalMQTT = Buffer.from(getFrmPayload, 'base64').toString();
});

router.get('/', (req, res) => {
  var str = "";
  
	for (var i = 0 ; i < globalMQTT.length; i++)
	{
		str += globalMQTT.charCodeAt(i).toString() + " ";
	}
  res.json(str);
})

module.exports = router;