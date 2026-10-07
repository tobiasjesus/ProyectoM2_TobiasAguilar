import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import pool from '../db/config.js';

const stamp = Date.now();
let authorId;
let postId;

beforeAll(async () => {
  const author = await pool.query(
    'INSERT INTO authors (name, email) VALUES ($1, $2) RETURNING id',
    ['Author de posts', `posts-${stamp}@example.com`]
  );
  authorId = author.rows[0].id;
  const post = await pool.query(
    'INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING id',
    ['Post de prueba', 'Contenido de prueba', authorId]
  );
  postId = post.rows[0].id;
});

afterAll(async () => {
  await pool.query('DELETE FROM authors WHERE id = $1', [authorId]);
  await pool.end();
});

describe('Posts API', () => {
  it('GET /posts devuelve 200 y un array', async () => {
    const res = await request(app).get('/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /posts/author/:authorId devuelve los posts con datos del author', async () => {
    const res = await request(app).get(`/posts/author/${authorId}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].author_name).toBe('Author de posts');
  });

  it('POST /posts crea un post y devuelve 201 con published false por defecto', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ title: 'Nuevo post', content: 'Contenido nuevo', author_id: authorId });
    expect(res.status).toBe(201);
    expect(res.body.published).toBe(false);
  });

  it('POST /posts devuelve 400 si falta title', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ content: 'Sin título', author_id: authorId });
    expect(res.status).toBe(400);
  });

  it('POST /posts devuelve 400 si el author_id no existe', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ title: 'X', content: 'Y', author_id: 999999 });
    expect(res.status).toBe(400);
  });

  it('PUT /posts/:id actualiza el post y devuelve 200', async () => {
    const res = await request(app)
      .put(`/posts/${postId}`)
      .send({ title: 'Editado', content: 'Contenido editado', author_id: authorId, published: true });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Editado');
    expect(res.body.published).toBe(true);
  });

  it('DELETE /posts/:id devuelve 404 si no existe', async () => {
    const res = await request(app).delete('/posts/999999');
    expect(res.status).toBe(404);
  });

  it('DELETE /posts/:id elimina el post y devuelve 204', async () => {
    const res = await request(app).delete(`/posts/${postId}`);
    expect(res.status).toBe(204);
  });
});