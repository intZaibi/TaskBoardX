const request = require('supertest');
const app = require('../src/app.js');

const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUxODY5NDk2LCJleHAiOjE3NTE4NzMwOTZ9._U04XXgA0QPwTACNFaS1waOKQrO0zau_btQxv8jTrG4';
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUxODcwNDI5LCJleHAiOjE3NTE4NzQwMjl9.D8oqC_oIe6kGn1bJcQPc05yCPcNM-90bqlEasfFe3b8';

describe('🧪 Task 1: CRUD & Bulk Operations', () => {
  let courseId, userProjectId, adminProjectId;

  test('User can create a course', async () => {
    const res = await request(app)
      .post('/courses')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'React Basics' });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('React Basics');
    courseId = res.body.id;
  });

  test('User can update their course', async () => {
    const res = await request(app)
      .patch(`/courses/${courseId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'React Advanced' });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('React Advanced');
  });

  test('Admin can delete any course', async () => {
    const res = await request(app)
      .delete(`/courses/${courseId}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(200);
  });

  test('User creates a project', async () => {
    const res = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'User Project' });

    expect(res.statusCode).toBe(201);
    userProjectId = res.body.id;
  });

  test('Admin creates a project', async () => {
    const res = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Admin Project' });

    expect(res.statusCode).toBe(201);
    adminProjectId = res.body.id;
  });

  test('User cannot update admin’s project', async () => {
    const res = await request(app)
      .patch(`/projects/${adminProjectId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Hack' });

    expect(res.statusCode).toBe(403);
  });

  test('Admin can update user’s project', async () => {
    const res = await request(app)
      .patch(`/projects/${userProjectId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Admin Updated' });

    expect(res.statusCode).toBe(200);
    // expect(res.body.name).toBe('Admin Updated');
  });

  test('Admin can bulk update project statuses', async () => {
    const res = await request(app)
      .patch('/projects/bulk-status')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ids: [userProjectId, adminProjectId], status: 'done' });

    expect(res.statusCode).toBe(200);
    expect(res.body.updated.length).toBe(2);
    expect(res.body.updated[0].status).toBe('done');
  });
});
