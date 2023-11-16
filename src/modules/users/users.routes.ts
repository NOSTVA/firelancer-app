import type { FastifyInstance } from "fastify";
import { $ref, userSchemas } from "@/modules/users/users.schemas";
import {
  loginUserHandler,
  logoutUserHandler,
  registerUserHandler,
} from "@/modules/users/users.controllers";

export async function usersRoutes(app: FastifyInstance) {
  // REGISTER USER SCHEMAS
  for (const schema of userSchemas) {
    app.addSchema(schema);
  }

  // ENDPOINTS
  app.post(
    "/register",
    {
      schema: {
        body: $ref("create_user_body"),
        response: {
          201: $ref("create_user_response"),
        },
      },
    },
    registerUserHandler
  );

  app.post(
    "/login",
    {
      schema: {
        body: $ref("user_login_body"),
        response: {
          200: $ref("user_login_response"),
        },
      },
    },
    loginUserHandler
  );

  app.post("/logout", logoutUserHandler);
}
