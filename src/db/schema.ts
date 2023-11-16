import {
  date,
  integer,
  primaryKey,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  username: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  password: varchar("password", { length: 256 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  type: varchar("type").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  overview: varchar("overview", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("ownerId")
    .references(() => users.id)
    .notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  overview: varchar("overview", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const team_members = pgTable(
  "team_members",
  {
    userId: uuid("userId")
      .references(() => users.id)
      .notNull(),
    teamId: uuid("teamId")
      .references(() => teams.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (team_members) => ({
    cpk: primaryKey(team_members.userId, team_members.teamId),
  })
);

export const team_roles = pgTable("team_roles", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  teamId: uuid("teamId")
    .references(() => teams.id)
    .notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  color: integer("color").default(0x3499db).notNull(),
  permissions: text("permissions").array().$type<Array<string>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const team_members_roles = pgTable(
  "team_members_roles",
  {
    userId: uuid("userId")
      .references(() => users.id)
      .notNull(),
    teamId: uuid("teamId")
      .references(() => teams.id)
      .notNull(),
    roleId: uuid("roleId")
      .references(() => team_roles.id)
      .notNull(),
  },
  (team_members_roles) => ({
    cpk: primaryKey(
      team_members_roles.userId,
      team_members_roles.teamId,
      team_members_roles.roleId
    ),
  })
);

export const team_invitations = pgTable("team_invitations", {
  id: uuid("id ").primaryKey().defaultRandom().notNull(),
  teamId: uuid("teamId")
    .references(() => teams.id)
    .notNull(),
  userId: uuid("userId")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
