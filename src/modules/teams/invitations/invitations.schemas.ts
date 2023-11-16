import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

// CREATE TEAM INVITATIO TOKEN
export const create_team_invitation_body = z.object({
  userId: z.string().uuid(),
});

export type CreateInvitationBody = z.infer<typeof create_team_invitation_body>;

// BUILD JSON SCHEMAS
export const { schemas: teamInvitationSchemas, $ref } = buildJsonSchemas(
  {
    create_team_invitation_body,
  },
  { $id: "teamInvitationSchema" }
);
