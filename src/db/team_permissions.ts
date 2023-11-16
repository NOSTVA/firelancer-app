import { z } from "zod";

export const team_permissions = [
  // members
  "members:delete",
  // members roles
  "members:roles:write",
  "members:roles:delete",
  "members:roles:edit",
  // invitations
  "invitations:write",
  // roles
  "roles:write",
  "roles:delete",
  "roles:edit",
] as const;
const team_permissions_schema = z.enum(team_permissions).array();

export type TeamPermissions = z.infer<typeof team_permissions_schema>;

// TEAMS PERMISSIONS DICTIONARY
export const TEAM_PERMISSIONS = team_permissions.reduce((acc, permission) => {
  acc[permission] = permission;
  return acc;
}, {} as Record<TeamPermissions[number], TeamPermissions[number]>);

// DEFAULT TEAM OWNER ROLE
export const team_owner_role = team_permissions as unknown as Array<string>;
