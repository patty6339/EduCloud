const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER || 'educloud_user',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'educloud',
  password: process.env.PG_PASSWORD || 'your_password',
  port: process.env.PG_PORT || 5432,
});

module.exports = pool;
