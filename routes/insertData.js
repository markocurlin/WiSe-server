const express = require('express');
const router = express.Router();
const pool = require('../services/db.js');

router.get('/', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO sensordata(temperature, humidityair, lux, humiditysoil)VALUES(1, 1, 1, 1)');
    const results = { 'results': (result) ? result.rows : null};
    res.json(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.json("Error " + err);
  }
})

module.exports = router;