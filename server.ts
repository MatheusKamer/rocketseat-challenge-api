import fastify from 'fastify';
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod';
import { fastifySwagger } from '@fastify/swagger';
import { createCoursesRoute } from './src/routes/create-courses.ts';
import { getCoursesRoute } from './src/routes/get-courses.ts';
import { getCourseByIdRoute } from './src/routes/get-courses-by-id.ts';
import scalarAPIReference from '@scalar/fastify-api-reference';

export const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

if (process.env.NODE_ENV === 'development') {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Desafio Node.js',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  });

  server.register(scalarAPIReference, {
    routePrefix: '/docs',
  });
}

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(createCoursesRoute);
server.register(getCoursesRoute);
server.register(getCourseByIdRoute);

server.listen({ port: 3000 }).then(() => {
  console.log('Fastify Server is running');
});
