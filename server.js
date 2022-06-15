const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const bodyParser = require('body-parser');
const dataRouter = require('./routes/data');
//const mqttRouter = require('./routes/mqtt');

app.get('/', cors(corsOptions), (req, res) => {
    res.json({ "name": 'Test' });
});

app.use('/data', dataRouter);
//app.use('/mqtt', mqttRouter);

var corsOptions = {
    origin: 'https://wi-se-client.vercel.app/',
    optionsSuccessStatus: 200
}

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

//

var server = require("http").Server(app); 
var io = require("socket.io")(server);

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