import { db } from "@/db";
import { team_owner_role } from "@/db/team_permissions";
import { InferInsertModel, and, eq } from "drizzle-orm";
import {
  team_members,
  team_members_roles,
  team_roles,
  teams,
} from "@/db/schema";

export async function findTeamMember({
  userId,
  teamId,
}: {
  userId: string;
  teamId: string;
}) {
  const rows = await db
    .select({
      member: team_members,
      role: team_roles,
      team: teams,
    })
    .from(team_members)
    .where(
      and(eq(team_members.userId, userId), eq(team_members.teamId, teamId))
    )
    .leftJoin(
      team_members_roles,
      and(
        eq(team_members_roles.userId, team_members.userId),
        eq(team_members_roles.teamId, team_members.teamId)
      )
    )
    .leftJoin(team_roles, eq(team_roles.id, team_members_roles.roleId))
    .leftJoin(teams, eq(team_members.teamId, teamId));

  if (!rows.length) {
    return null;
  }

  type Member = typeof team_members.$inferInsert;
  type Role = typeof team_roles.$inferInsert;

  const result = rows.reduce<
    Record<string, { member: Member; roles: Role[]; permissions: Set<string> }>
  >((acc, row) => {
    const member = row.member;
    const role = row.role;

    if (!acc[member.userId]) {
      acc[member.userId] = {
        member,
        roles: [],
        permissions: new Set<string>(),
      };
    }

    if (role) {
      acc[member.userId].roles.push(role);

      if (role.permissions?.length) {
        for (const permission of role.permissions) {
          acc[member.userId].permissions.add(permission);
        }
      }
    }

    return acc;
  }, {});

  const { member, roles, permissions } = Object.values(result)[0];
  const isOwner = member.userId === rows[0].team?.ownerId;

  return {
    ...member,
    isOwner: isOwner,
    roles,
    permissions: isOwner ? team_owner_role : Array.from(permissions),
  };
}

export async function addRoleToTeamMember(
  data: InferInsertModel<typeof team_members_roles>
) {
  const result = await db.insert(team_members_roles).values(data).returning();
  return result[0];
}
