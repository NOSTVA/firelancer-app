import type { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserBody, UserLoginBody } from "@/modules/users/users.schemas";
import { createUser, getUserByEmail } from "@/modules/users/users.services";
import argon2 from "argon2";

export async function registerUserHandler(
  request: FastifyRequest<{ Body: CreateUserBody }>,
  reply: FastifyReply
) {
  try {
    const user = await createUser(request.body);
    return user;
  } catch (e: any) {
    console.log(e.code);
    if (e.code === "23505") {
      reply.code(400);
      throw new Error("account already exists");
    }
    throw new Error(e);
  }
}

export async function loginUserHandler(
  request: FastifyRequest<{ Body: UserLoginBody }>,
  reply: FastifyReply
) {
  const { email, password } = request.body;
  const user = await getUserByEmail({ email });

  if (!user) {
    reply.code(404);
    throw new Error("invalid email or password");
  }

  const verified = await argon2.verify(user.password, password);
  const access_token = await reply.jwtSign({
    id: user.id,
    email: user.email,
    username: user.username,
  });

  if (!verified) {
    reply.code(400);
    throw new Error("invalid email or password");
  }

  return reply
    .code(200)
    .setCookie("access_token", access_token, {
      path: "/",
      httpOnly: true,
      secure: false,
    })
    .send({ access_token });
}

export async function logoutUserHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  return reply
    .code(200)
    .clearCookie("access_token", {
      path: "/",
      httpOnly: true,
      secure: false,
    })
    .send({ message: "logged out successfully" });
}
