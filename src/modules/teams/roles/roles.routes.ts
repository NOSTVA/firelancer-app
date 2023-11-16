import type { FastifyInstance } from "fastify";
import {
  $ref,
  CreateTeamRoleBody,
  teamRoleSchemas,
} from "@/modules/teams/roles/roles.schemas";
import { createTeamRoleHandler } from "@/modules/teams/roles/roles.controllers";
import { TEAM_PERMISSIONS } from "@/db/team_permissions";

export async function teamRolesRoutes(app: FastifyInstance) {
  // REGISTER TEAM ROLES SCHEMAS
  for (const schema of teamRoleSchemas) {
    app.addSchema(schema);
  }

  // ENDPOINTS
  app.post<{ Body: CreateTeamRoleBody; Params: { teamId: string } }>(
    "/:teamId/roles/create",
    {
      preHandler: [
        app.user_authenticate,
        app.team_authenticate,
        app.guard.scope(TEAM_PERMISSIONS["roles:write"]),
      ],
      schema: {
        description: "Allow a team member to create new team roles",
        params: {
          teamId: {
            type: "string",
            format: "uuid",
          },
        },
        body: $ref("create_team_role_body"),
      },
    },
    createTeamRoleHandler
  );
}
