const express = require('express');
const pool = require('./db/config');
const authorsRouter = require('./routes/authors');
const postsRouter = require('./routes/posts');
const errorHandler = require('./middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./openapi.yaml');

const app = express();

app.use(express.json());
app.use('/authors', authorsRouter);
app.use('/posts', postsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', (req, res) => {
  res.json({
    message: 'MiniBlog API',
    endpoints: { authors: '/authors', posts: '/posts', docs: '/api-docs' },
  });
});

app.get('/health', async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.json({ status: 'ok', db_time: result.rows[0].now });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use(errorHandler);

module.exports = app;