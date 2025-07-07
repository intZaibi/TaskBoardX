const request = require('supertest');
const app = require('../src/app.js');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

describe('🧪 Task 2: Auth Flow (JWT, Refresh, Logout)', () => {
  let token;

  test('Login with valid user returns JWT', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@example.com' }); // assume "alice" exists in seed-data

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('Login with invalid user fails', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'ghost@example.com' });

    expect(res.statusCode).toBe(404);
  });

  test('Token can access protected route', async () => {
    const res = await request(app)
      .get('/courses')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 404]).toContain(res.statusCode); // depends on data
  });

  test('Refresh token returns new token', async () => {
    const res = await request(app)
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    token = res.body.token;
  });

  test('Logout blacklists the token', async () => {
    const res = await request(app)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  test('Blacklisted token cannot access protected route', async () => {
    const res = await request(app)
      .get('/projects')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/Unauthorized/i);
  });

  test('Expired token fails (simulated)', async () => {
    // Issue short-lived token
    const shortToken = jwt.sign({ userId: 1, role: 'user' }, JWT_SECRET, { expiresIn: '1s' });

    // Wait for it to expire
    await new Promise(resolve => setTimeout(resolve, 1500));

    const res = await request(app)
      .get('/projects')
      .set('Authorization', `Bearer ${shortToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/expired|invalid/i);
  });
});
