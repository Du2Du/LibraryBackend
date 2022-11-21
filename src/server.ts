import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import * as dotenv from "dotenv";
import Fastify from "fastify";
import AutoLoad from "@fastify/autoload";
import path from "path";
import { BookController, UserControler } from "./Controllers";
dotenv.config();

const app = async () => {
  const fastify = Fastify({
    logger: true,
  });

  fastify.register(fastifyCookie, {
    parseOptions: {
      httpOnly: true,
      secure: true,
    },
    hook: "preHandler",
  } as FastifyCookieOptions);

  fastify.register(fastifyJwt, {
    secret: process.env.TOKEN_SECRET ?? "",
  });

  await fastify.register(fastifyCors, {
    origin: true,
  });
  fastify.register(UserControler, {
    prefix: "/user",
  });
  fastify.register(BookController, {
    prefix: "/book",
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "Controllers"),
    options: {},
  });

  fastify.listen({ port: 8099 });
};
app();
