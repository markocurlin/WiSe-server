const db = require("./db");

async function getDataFromDB() {
  const rows = await db.query(
    'SELECT * FROM sensordata'
  );

  if (!rows) {
    return [];
  }

  return rows;
}

module.exports = {
  getDataFromDB
}