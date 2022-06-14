const express = require('express');
const router = express.Router();
const data = require('../services/data');

router.get("/", async (req, res, next) => {
  try {
    const params = await data.getDataFromDB();  
    res.json("dsadas");  
  } catch(err) {
    console.error(`Error while getting subjects`, err.message);
    next(err);
  }
})

module.exports = router;