import z from "zod";
import { buildJsonSchemas } from "fastify-zod";

// CREATE TEAM
const create_team_body = z.object({
  name: z.string().min(2),
  overview: z.string(),
});

export type CreateTeamBody = z.infer<typeof create_team_body>;

// BUILD JSON SCHEMAS
export const { schemas: teamSchemas, $ref } = buildJsonSchemas(
  {
    create_team_body,
  },
  { $id: "teamSchema" }
);
