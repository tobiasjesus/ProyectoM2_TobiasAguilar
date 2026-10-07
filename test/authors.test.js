import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import pool from '../db/config.js';

const stamp = Date.now();
const fixtureEmail = `fixture-${stamp}@example.com`;
const newEmail = `nuevo-${stamp}@example.com`;
let fixtureId;

beforeAll(async () => {
  const result = await pool.query(
    'INSERT INTO authors (name, email) VALUES ($1, $2) RETURNING id',
    ['Author de prueba', fixtureEmail]
  );
  fixtureId = result.rows[0].id;
});

afterAll(async () => {
  await pool.query('DELETE FROM authors WHERE email IN ($1, $2)', [fixtureEmail, newEmail]);
  await pool.end();
});

describe('Authors API', () => {
  it('GET /authors devuelve 200 y un array', async () => {
    const res = await request(app).get('/authors');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /authors/:id devuelve 200 y el author', async () => {
    const res = await request(app).get(`/authors/${fixtureId}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(fixtureEmail);
  });

  it('GET /authors/:id devuelve 404 si no existe', async () => {
    const res = await request(app).get('/authors/999999');
    expect(res.status).toBe(404);
  });

  it('GET /authors/:id devuelve 400 si el id no es numérico', async () => {
    const res = await request(app).get('/authors/abc');
    expect(res.status).toBe(400);
  });

  it('POST /authors crea un author y devuelve 201', async () => {
    const res = await request(app)
      .post('/authors')
      .send({ name: 'Nuevo Author', email: newEmail, bio: 'Bio de prueba' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Nuevo Author');
  });

  it('POST /authors devuelve 400 si falta name', async () => {
    const res = await request(app).post('/authors').send({ email: 'sinnombre@example.com' });
    expect(res.status).toBe(400);
  });

  it('POST /authors devuelve 409 si el email ya existe', async () => {
    const res = await request(app).post('/authors').send({ name: 'Duplicado', email: fixtureEmail });
    expect(res.status).toBe(409);
  });

  it('DELETE /authors/:id devuelve 404 si no existe', async () => {
    const res = await request(app).delete('/authors/999999');
    expect(res.status).toBe(404);
  });
});