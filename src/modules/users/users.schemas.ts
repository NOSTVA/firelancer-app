import z from "zod";
import { buildJsonSchemas } from "fastify-zod";

// REGISTER
const create_user_body = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).max(64),
  dateOfBirth: z.date().transform((date) => date.toISOString().split("T")[0]),
  type: z.enum(["freelancer", "customer"]),
  title: z.string().min(2),
  overview: z.string(),
});

const create_user_response = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  type: z.enum(["freelancer", "customer"]),
  title: z.string().min(2),
  overview: z.string(),
});

export type CreateUserBody = z.infer<typeof create_user_body>;

// LOGIN
const user_login_body = z.object({
  email: z.string().email(),
  password: z.string(),
});

const user_login_response = z.object({
  access_token: z.string(),
});

export type UserLoginBody = z.infer<typeof user_login_body>;

// BUILD JSON SCHEMAS
export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    create_user_body,
    create_user_response,
    user_login_body,
    user_login_response,
  },
  { $id: "userSchema" }
);
