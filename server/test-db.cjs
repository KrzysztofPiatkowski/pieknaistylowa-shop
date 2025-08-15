// server/test-db.cjs
require('dotenv').config();             // wczyta server/.env
const mysql = require('mysql2/promise'); // CommonJS

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows] = await conn.query('SELECT 1 + 1 AS two');
    console.log('Połączenie OK. Wynik testu:', rows);
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Połączenie NIEUDANE:', err);
    process.exit(1);
  }
})();
