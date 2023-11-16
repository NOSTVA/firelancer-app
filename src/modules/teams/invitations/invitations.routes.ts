import { TEAM_PERMISSIONS } from "@/db/team_permissions";
import { FastifyInstance } from "fastify";
import {
  acceptTeamInvitationHandler,
  createTeamInvitationHandler,
} from "./invitations.controllers";
import { $ref, teamInvitationSchemas } from "./invitations.schemas";

export async function teamInvitationsRoutes(app: FastifyInstance) {
  // REGISTER TEAM SCHEMAS
  for (const schema of teamInvitationSchemas) {
    app.addSchema(schema);
  }

  // ENDPOINTS
  app.post(
    "/:teamId/invitations/create",
    {
      preHandler: [
        app.user_authenticate,
        app.team_authenticate,
        app.guard.scope(TEAM_PERMISSIONS["invitations:write"]),
      ],

      schema: {
        description: "Allow a team member to create an invitation token",
        params: {
          teamId: {
            type: "string",
            format: "uuid",
          },
        },
        body: $ref("create_team_invitation_body"),
      },
    },
    createTeamInvitationHandler
  );

  app.get(
    "/invitations/:invitationId",
    {
      preHandler: [app.user_authenticate],

      schema: {
        description: "Accept a team invitation",
        params: {
          invitationId: {
            type: "string",
            format: "uuid",
          },
        },
      },
    },
    acceptTeamInvitationHandler
  );
}
