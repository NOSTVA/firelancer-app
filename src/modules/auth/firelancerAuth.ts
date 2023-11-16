const fp = require("fastify-plugin");
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { findTeamMember } from "@/modules/teams/members/members.services";
import fastifyGuard from "fastify-guard";

async function firelancerAuth(fastify: FastifyInstance) {
  fastify.decorateRequest("member", null);

  // USER AUTHENTICATE
  fastify.decorate(
    "user_authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      return await request.jwtVerify();
    }
  );

  // TEAM MEMBER AUTHENTICATE
  fastify.decorate(
    "team_authenticate",
    async function (
      request: FastifyRequest<{ Params: { teamId: string } }>,
      reply: FastifyReply
    ) {
      const member = await findTeamMember({
        teamId: request.params.teamId,
        userId: request.user.id,
      });

      if (!member) {
        reply.code(401);
        throw new Error("You are not a member of this team");
      }

      request.member = member;
    }
  );

  // TEAM MEMBER PERMISSIONS GUARD
  fastify.register(fastifyGuard, {
    requestProperty: "member",
    scopeProperty: "permissions",
    errorHandler(result, request, reply) {
      reply.code(401);
      throw new Error("You are not authorized to perform this action");
    },
  });
}

export default fp(firelancerAuth);

// DECLARATIONS
declare module "fastify" {
  export interface FastifyInstance {
    user_authenticate: <T>(
      request: FastifyRequest,
      reply: FastifyReply
    ) => unknown;
    team_authenticate: (
      request: FastifyRequest<{ Params: { teamId: string } }>,
      reply: FastifyReply
    ) => unknown;
  }

  export interface FastifyRequest {
    member: Awaited<ReturnType<typeof findTeamMember>>;
  }
}

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      id: string;
      email: string;
      username: string;
    };
  }
}
