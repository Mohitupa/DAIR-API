const { Pool } = require("pg");

const pool = new Pool({
  user: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
  host: 'localhost',
})

pool.on('connect', () => {
  console.log('DATABASE CONNECTED!');
});

module.exports = { pool };