import { test, expect } from 'vitest';
import request from 'supertest';
import { server } from '../app.ts';
import { makeCourse } from '../tests/factories/make-course.ts';

test('get course by id', async () => {
  await server.ready();

  const course = await makeCourse();

  const response = await request(server.server).get(`/courses/${course.id}`);

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

  const course = await makeCourse();

  const response = await request(server.server).get(
    `/courses/b2a36ec4-6dfa-47e4-afc5-466c59818618`
  );

  expect(response.statusCode).toEqual(404);
  expect(response.body).toEqual({
    message: expect.any(String),
  });
});
