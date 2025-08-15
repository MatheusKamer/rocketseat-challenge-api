import { test, expect } from 'vitest';
import request from 'supertest';
import { server } from '../app.ts';
import { makeCourse } from '../tests/factories/make-course.ts';
import { makeAuthenticatedUser } from '../tests/factories/make-user.ts';

test('get course by id', async () => {
  await server.ready();

  const { token } = await makeAuthenticatedUser('student');
  const course = await makeCourse();

  const response = await request(server.server)
    .get(`/courses/${course.id}`)
    .set('Authorization', token);

  expect(response.statusCode).toEqual(200);
  expect(response.body).toEqual({
    course: {
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
    },
  });
});

test('return 404 for course not found ', async () => {
  await server.ready();

  const { token } = await makeAuthenticatedUser('student');

  const response = await request(server.server)
    .get(`/courses/b2a36ec4-6dfa-47e4-afc5-466c59818618`)
    .set('Authorization', token);

  expect(response.statusCode).toEqual(404);
  expect(response.body).toEqual({
    message: expect.any(String),
  });
});
