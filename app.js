const express = require('express');
const pool = require('./db/config');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'MiniBlog API',
    endpoints: { authors: '/authors', posts: '/posts' },
  });
});

app.get('/health', async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.json({ status: 'ok', db_time: result.rows[0].now });
});

module.exports = app;