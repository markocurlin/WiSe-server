const express = require('express');
const router = express.Router();

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

DATABASE_URL = 'postgres://vaqvtedfomzxdc:d77cc333c761c0314ff96440010f658e4c95e9066c58ffb2460c2d76764f4ed9@ec2-34-242-8-97.eu-west-1.compute.amazonaws.com:5432/dbga6btbrrmhl7';

router.get('/', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM sensordata');
    const results = { 'results': (result) ? result.rows : null};
    res.json(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.json("Error " + err);
  }
})

module.exports = router;