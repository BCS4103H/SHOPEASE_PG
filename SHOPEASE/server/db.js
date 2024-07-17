const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'shopease',
  password: 'xxxxxx', // use your actual password
  port: 5434, // your actual port number
});

module.exports = pool;
