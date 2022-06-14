const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const bodyParser = require('body-parser');

//const dataRouter = require('./routes/data');

DATABASE_URL = 'postgres://vaqvtedfomzxdc:d77cc333c761c0314ff96440010f658e4c95e9066c58ffb2460c2d76764f4ed9@ec2-34-242-8-97.eu-west-1.compute.amazonaws.com:5432/dbga6btbrrmhl7';

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/', cors(corsOptions), (req, res) => {
    res.json({ "name": 'Marko1234' });
});

app.get('/marko', (req, res) => {
    res.json({ "name": 'Aaa' });
});

app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM sensordata');
      const results = { 'results': (result) ? result.rows : null};
      //res.render('pages/db', results );
      res.json(results);
      client.release();
    } catch (err) {
      console.error(err);
      res.json("Error " + err);
    }
})

//app.use('/data', dataRouter);

var corsOptions = {
    origin: 'https://wi-se-client.vercel.app/',
    optionsSuccessStatus: 200
}

/*
app.use(cors({
    origin: "https://wi-se-client.vercel.app/",
    credentials: true,
}));*/

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