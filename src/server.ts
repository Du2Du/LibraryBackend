import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import * as dotenv from "dotenv";
import Fastify from "fastify";
import { BookController, UserControler } from "./Controllers";
import { authenticate } from "./Utils/authenticate";
import qs from "qs";
dotenv.config();

const app = async () => {
  const fastify = Fastify({
    logger: true,
    querystringParser: (str) => qs.parse(str),
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
    if (
      req.url !== "/user/login" &&
      req.url !== "/user" &&
      req.url !== "/user/refresh-token"
    )
      return await authenticate(req, res);
  });
  fastify.register(fastifyCookie, {
    parseOptions: {
      httpOnly: true,
      secure: true,
    },
    secret: process.env.TOKEN_SECRET,
    hook: "preHandler",
  } as FastifyCookieOptions);

  fastify.listen({ port: 8099 });
};
app();
