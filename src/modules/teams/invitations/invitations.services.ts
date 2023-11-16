import { db } from "@/db";
import { team_invitations, team_members } from "@/db/schema";
import { InferInsertModel, and, eq } from "drizzle-orm";

export async function createTeamInvitation(
  data: InferInsertModel<typeof team_invitations>
) {
  const result = await db.insert(team_invitations).values(data).returning();

  return result[0];
}

export async function acceptTeamInvitation({
  invitationId,
  userId,
}: {
  invitationId: string;
  userId: string;
}) {
  // check delete team invitation if exists
  const rows = await db
    .delete(team_invitations)
    .where(
      and(
        eq(team_invitations.id, invitationId),
        eq(team_invitations.userId, userId)
      )
    )
    .returning();

  // no team invitation found
  if (rows.length === 0) return null;

  // register user to team
  const result = await db
    .insert(team_members)
    .values({ userId: rows[0].userId, teamId: rows[0].teamId })
    .returning();

  return result[0];
}
