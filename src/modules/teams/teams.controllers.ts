import type { FastifyRequest } from "fastify";
import type { CreateTeamBody } from "@/modules/teams/teams.schemas";
import { createTeam, getTeams } from "@/modules/teams/teams.services";

export async function createTeamHandler(
  request: FastifyRequest<{
    Body: CreateTeamBody;
  }>
) {
  // create team, set user as team owner
  const team = await createTeam({
    name: request.body.name,
    overview: request.body.overview,
    ownerId: request.user.id,
  });

  return team;
}

export async function getTeamsHandler() {
  const teams = await getTeams({ limit: 10 });
  return teams;
}
