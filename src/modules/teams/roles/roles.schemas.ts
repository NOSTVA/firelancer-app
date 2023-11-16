import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { team_permissions } from "@/db/team_permissions";

// CREATE TEAM ROLE
const create_team_role_body = z.object({
  name: z.string(),
  color: z.number().int(),
  permissions: z.enum(team_permissions).array(),
});

export type CreateTeamRoleBody = z.infer<typeof create_team_role_body>;

// BUILD JSON SCHEMAS
export const { schemas: teamRoleSchemas, $ref } = buildJsonSchemas(
  {
    create_team_role_body,
  },
  { $id: "teamRoleSchema" }
);
