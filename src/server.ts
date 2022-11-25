import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import * as dotenv from "dotenv";
import Fastify from "fastify";
import AutoLoad from "@fastify/autoload";
import path from "path";
import { BookController, UserControler } from "./Controllers";
import { authenticate } from "./Utils/authenticate";
dotenv.config();

const app = async () => {
  const fastify = Fastify({
    logger: true,
  });

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

  fastify.addHook("onRequest", async (req, res) => {
    if (req.url !== "/user/login" && req.url !== "/user/")
      return await authenticate(req, res);
  });

  fastify.listen({ port: 8099 });
};
app();
