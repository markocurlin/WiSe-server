const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const bodyParser = require('body-parser');
//const dataRouter = require('./routes/data');
const transformdata = require('./services/transformdata');

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

DATABASE_URL = 'postgres://vaqvtedfomzxdc:d77cc333c761c0314ff96440010f658e4c95e9066c58ffb2460c2d76764f4ed9@ec2-34-242-8-97.eu-west-1.compute.amazonaws.com:5432/dbga6btbrrmhl7';

/*
app.use(cors({
  origin: 'https://wi-se-client.vercel.app/',
  credentials: true
}));*/

/*
var corsOptions = {
  origin: 'https://wi-se-client.vercel.app/',
  optionsSuccessStatus: 200
}
*/

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

//zasad je ovo rjesenje, pitanje dokad???

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

let globalData = '';

/*cors(corsOptions),*/

app.get('/', (req, res) => {
  const temp = transformdata.transformHexToDec(globalMQTT);
  globalData = transformdata.transformString(temp);

  if (globalData.length !== 0) {
    res.json(globalData);
  }
  res.json(globalData);
  //res.json('13 14 15 17');
});

//app.use('/data', dataRouter);
//baza podataka

app.post('/data',  async (req, res) => {
  try {
    const data = req.body;
    
    if (data) {
      const client = await pool.connect();
      const result = await client.query(`SELECT ${data.param} AS paramname FROM sensordata`);
      const results = (result) ? result.rows : null;
      res.json(results);
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.json("Error " + err);
  }
})

app.post('/insertdata', async (req, res) => {
  if (globalData.length === 4) {
    try {
      client = await pool.connect();
      const result = await client.query(`INSERT INTO sensordata(temperature, humidityair, lux, humiditysoil)VALUES(${globalData[0]}, ${globalData[1]}, ${globalData[2]}, ${globalData[3]})`);
      //const results = { 'results': (result) ? result.rows : null};
      res.json(result);
      client.release();
    } catch (err) {
      console.error(err);
      res.json("Error " + err);
    }
  }
});

//

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