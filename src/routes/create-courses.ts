import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { db } from '../database/client.ts';
import { courses } from '../database/schema.ts';
import z from 'zod';

export const createCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/courses',
    {
      schema: {
        tags: ['courses'],
        summary: 'Create a course',
        body: z.object({
          title: z.string().min(5, 'Title must be five characters'),
          description: z.string().optional(),
        }),
        response: {
          201: z
            .object({ id: z.uuid() })
            .describe('The course has been successfully created'),
          400: z.object({ message: z.string() }).describe('Error'),
        },
      },
    },
    async (request, response) => {
      const { title, description } = request.body;

      const result = await db
        .insert(courses)
        .values({
          title,
          description,
        })
        .returning();

      return response.status(201).send({ id: result[0].id });
    }
  );
};
