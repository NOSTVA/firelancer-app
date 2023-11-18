import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { SwaggerTheme } from "swagger-themes";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { withRefResolver } from "fastify-zod";
import { logger } from "@/utils/logger";
import { env } from "@/config/env";
import { usersRoutes } from "@/modules/users/users.routes";
import { teamsRoutes } from "@/modules/teams/teams.routes";
import firelancerAuth from "@/modules/auth/auth";

export async function buildServer() {
  const app = fastify({
    logger,
  });

  /*
   * PLUGINS
   */

  // FIRELANCER AUTH
  app.register(firelancerAuth);

  // COOKIE
  app.register(fastifyCookie);

  // JWT
  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: "access_token",
      signed: false,
    },
  });

  // SWAGGER
  app.register(
    fastifySwagger,
    withRefResolver({
      swagger: {
        basePath: process.env.NGINX_BASE_PATH,
        info: {
          title: "Firelancer API",
          description: "API Documentation",
          version: "1.0.0",
        },
      },
    })
  );

  // SWAGGER-UI
  const theme = new SwaggerTheme("v3");
  const content = theme.getBuffer("dark");

  app.register(fastifySwaggerUi, {
    routePrefix: "/documentation",
    theme: {
      css: [{ filename: "theme.css", content: content }],
    },
  });

  /*
   * ROUTES
   */

  app.register(usersRoutes, { prefix: "/users" });
  app.register(teamsRoutes, { prefix: "/teams" });

  return app;
}
