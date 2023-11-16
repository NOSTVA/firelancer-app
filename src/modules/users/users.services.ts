import { db } from "@/db";
import { users } from "@/db/schema";
import argon2 from "argon2";
import { InferInsertModel, eq } from "drizzle-orm";

export async function createUser(data: InferInsertModel<typeof users>) {
  const hashed = await argon2.hash(data.password);

  const result = await db
    .insert(users)
    .values({ ...data, password: hashed })
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
      type: users.type,
      title: users.title,
      overview: users.overview,
    });

  return result[0];
}

export async function getUserByEmail({ email }: { email: string }) {
  const result = await db.select().from(users).where(eq(users.email, email));

  if (!result.length) return null;
  return result[0];
}
