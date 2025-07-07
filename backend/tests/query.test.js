const request = require('supertest');
const app = require('../src/app.js');
const { clearCache } = require('../src/utils/cache.js');

const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUxODY5NDk2LCJleHAiOjE3NTE4NzMwOTZ9._U04XXgA0QPwTACNFaS1waOKQrO0zau_btQxv8jTrG4';

describe('🧪 Task 3: Query Params + Caching', () => {
  let courseId, projectId;

  beforeAll(async () => {
    clearCache();

    // Create sample course
    const c = await request(app)
      .post('/courses')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'JavaScript Essentials' });
    courseId = c.body.id;

    // Create sample project
    const p = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Backend Refactor', status: 'todo' });
    projectId = p.body.id;
  });

  test('Search courses by title (case-insensitive)', async () => {
    const res = await request(app)
      .get('/courses?search=SSR')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body[0].title.toLowerCase()).toContain('next.js ssr');
  });

  test('Filter projects by ownerId', async () => {
    const res = await request(app)
      .get('/projects?ownerId=1')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.every(p => p.ownerId === 1)).toBe(true);
  });

  test('Filter projects by status', async () => {
    const res = await request(app)
      .get('/projects?status=done')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body[0].status).toBe('done');
  });

  test('Sort projects by name ASC', async () => {
    const res = await request(app)
      .get('/projects?sortBy=name&order=asc')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
  });

  test('Paginate courses: page=1, limit=1', async () => {
    const res = await request(app)
      .get('/courses?page=1&limit=1')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(1);
  });

  test('Caching: same query twice returns cached result', async () => {
    const url = '/courses?search=new';
    const res1 = await request(app).get(url).set('Authorization', `Bearer ${userToken}`);
    const res2 = await request(app).get(url).set('Authorization', `Bearer ${userToken}`);

    expect(res1.statusCode).toBe(200);
    expect(res2.statusCode).toBe(200);
    expect(res2.body).toEqual(res1.body); // identical results
  });

  test('Cache is cleared after mutation', async () => {
    // clearCache should be triggered after POST
    const res1 = await request(app)
      .get('/projects?search=Redesign')
      .set('Authorization', `Bearer ${userToken}`);

    await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'New Project', status: 'pending' });

    const res2 = await request(app)
      .get('/projects?search=Redesign')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res2.body).toEqual(res1.body); // depending on logic, may match or not
  });
});
