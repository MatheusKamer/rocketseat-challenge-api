import { test, expect } from 'vitest';
import request from 'supertest';
import { server } from '../app.ts';
import { faker } from '@faker-js/faker';

test('create a course', async () => {
  await server.ready();

  const response = await request(server.server)
    .post('/courses')
    .set('Content-Type', 'application/json')
    .send({ title: faker.lorem.words(4), description: 'teste' });

  expect(response.statusCode).toEqual(201);
  expect(response.body).toEqual({
    id: expect.any(String),
  });
});

test('title not provided', async () => {
  await server.ready();

  const response = await request(server.server)
    .post('/courses')
    .set('Content-Type', 'application/json');

  expect(response.statusCode).toEqual(400);
  expect(response.body).toEqual({
    message: expect.any(String),
  });
});
