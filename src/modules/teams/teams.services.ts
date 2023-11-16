import { db } from "@/db";
import { team_members, teams } from "@/db/schema";
import { InferInsertModel, eq } from "drizzle-orm";

export async function createTeam(data: InferInsertModel<typeof teams>) {
  const result = await db.transaction(async (tx) => {
    const result = await tx.insert(teams).values(data).returning();
    const result2 = await tx
      .insert(team_members)
      .values({
        userId: result[0].ownerId,
        teamId: result[0].id,
      })
      .returning();
    return {
      team: result[0],
      members: result2,
    };
  });

  return result;
}

export async function getTeams({
  limit = 50,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
}) {
  const rows = await db
    .select({
      team: teams,
      member: team_members,
    })
    .from(teams)
    .leftJoin(team_members, eq(team_members.teamId, teams.id))
    .limit(limit)
    .offset(offset);

  type Team = typeof teams.$inferInsert;
  type Member = typeof team_members.$inferInsert;

  const result = rows.reduce<Record<string, { team: Team; members: Member[] }>>(
    (acc, row) => {
      const team = row.team;
      const member = row.member;

      if (!acc[team.id]) {
        acc[team.id] = { team, members: [] };
      }

      if (member) {
        acc[team.id].members.push(member);
      }

      return acc;
    },
    {}
  );

  return Object.values(result);
}
