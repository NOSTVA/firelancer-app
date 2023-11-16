import { FastifyReply, FastifyRequest } from "fastify";
import { CreateTeamRoleBody } from "@/modules/teams/roles/roles.schemas";
import { createTeamRole } from "@/modules/teams/roles/roles.services";

export async function createTeamRoleHandler(
  request: FastifyRequest<{
    Body: CreateTeamRoleBody;
    Params: { teamId: string };
  }>,
  reply: FastifyReply
) {
  const role = await createTeamRole({
    ...request.body,
    teamId: request.params.teamId,
  });
  return reply.code(201).send({ role });
}
