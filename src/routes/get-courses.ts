import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { db } from '../database/client.ts';
import { courses, enrollments } from '../database/schema.ts';
import z from 'zod';
import { ilike, asc, SQL, and, count, eq } from 'drizzle-orm';

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/courses',
    {
      schema: {
        tags: ['courses'],
        summary: 'Get all courses',
        querystring: z.object({
          search: z.string().optional(),
          orderBy: z.enum(['title', 'id']).optional().default('id'),
          page: z.coerce.number().optional().default(1),
        }),
        response: {
          200: z.object({
            courses: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
                enrollments: z.number(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, response) => {
      const { search, orderBy, page } = request.query;

      const conditions: SQL[] | undefined = [];

      if (search) {
        conditions.push(ilike(courses.title, `%${search}%`));
      }

      const [result, total] = await Promise.all([
        db
          .select({
            id: courses.id,
            title: courses.title,
            enrollments: count(enrollments.courseId),
          })
          .from(courses)
          .leftJoin(enrollments, eq(enrollments.courseId, courses.id))
          .where(and(...conditions))
          .offset((page - 1) * 2)
          .orderBy(asc(courses[orderBy]))
          .limit(5)
          .groupBy(courses.id),
        db.$count(courses, and(...conditions)),
      ]);

      return response.send({ courses: result, total });
    }
  );
};
