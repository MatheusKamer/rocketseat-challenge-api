import fastify from 'fastify';
import crypto from 'crypto';

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

const courses = [
  { id: '1', title: 'Curso de Node.js' },
  { id: '2', title: 'Curso de React.js' },
  { id: '3', title: 'Curso de Pipeline CI/CD' },
];

type Params = {
  id: string;
};

type Body = {
  title: string;
};

server.get('/courses', () => {
  return { courses, page: 1 };
});

server.get('/courses/:id', (request, response) => {
  const params = request.params as Params;
  const courseId = params.id;

  const course = courses.find((course) => course.id === courseId);

  if (course) {
    return { course };
  }

  return response.status(404).send({ message: 'Course not found!' });
});

server.delete('/courses/:id', (request, response) => {
  const params = request.params as Params;
  const courseId = params.id;

  const newCourses = courses.filter((course) => course.id !== courseId);

  return { newCourses };
});

server.post('/courses', (request, response) => {
  const courseId = crypto.randomUUID();

  const body = request.body as Body;
  const courseTitle = body.title;

  if (!courseTitle) {
    return response.status(400).send({ message: 'Title is required' });
  }

  courses.push({ id: courseId, title: courseTitle });

  return response.status(201).send({ courseId });
});

server.listen({ port: 3000 }).then(() => {
  console.log('Fastify Server is running');
});
