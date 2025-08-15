import type { FastifyReply, FastifyRequest } from 'fastify';
import { getAuthenticatedUserFromRequest } from '../../utils/get-authenticated-user-from-request.ts';

export function checkUserRoleJWT(role: 'student' | 'manager') {
  return async function (request: FastifyRequest, response: FastifyReply) {
    const user = getAuthenticatedUserFromRequest(request);

    if (user.role !== role) {
      return response.status(403).send();
    }
  };
}
