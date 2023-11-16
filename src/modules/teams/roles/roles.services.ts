import { db } from "@/db";
import { team_roles } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";

export async function createTeamRole(
  data: InferInsertModel<typeof team_roles>
) {
  const result = await db.insert(team_roles).values(data).returning();

  return result[0];
}
