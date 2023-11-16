import type { FastifyInstance } from "fastify";
import { teamSchemas } from "@/modules/teams/teams.schemas";
import {
  createTeamHandler,
  getTeamsHandler,
} from "@/modules/teams/teams.controllers";
import { $ref } from "@/modules/teams/teams.schemas";
import { teamRolesRoutes } from "@/modules/teams/roles/roles.routes";
import { teamMembersRoutes } from "@/modules/teams/members/members.routes";
import { teamInvitationsRoutes } from "@/modules/teams/invitations/invitations.routes";

export async function teamsRoutes(app: FastifyInstance) {
  // REGISTER TEAM SCHEMAS
  for (const schema of teamSchemas) {
    app.addSchema(schema);
  }

  // ENDPOINTS
  app.post(
    "/create",
    {
      preHandler: [app.user_authenticate],
      schema: {
        body: $ref("create_team_body"),
      },
    },
    createTeamHandler
  );

  app.get(
    "/",
    { schema: { description: "Get teams metadata." } },
    getTeamsHandler
  );

  // TEAM ROUTES
  app.register(teamRolesRoutes);
  app.register(teamMembersRoutes);
  app.register(teamInvitationsRoutes);
}
