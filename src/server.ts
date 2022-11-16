import Fastify from "fastify";
import * as dotenv from "dotenv";
import fastifyCors from "@fastify/cors";
import { UserControler } from "./Controllers";
import fastifyCookie from "@fastify/cookie";
dotenv.config();

const app = async () => {
  const fastify = Fastify({
    logger: true,
  });

  fastify.register(fastifyCookie, {
    secret: process.env.TOKEN_SECRET,
    parseOptions: {},
  });

  await fastify.register(fastifyCors, {
    origin: true,
  });

  fastify.register(UserControler, {
    prefix: "/user",
  });

  fastify.listen({ port: 8099 });
};

app();
