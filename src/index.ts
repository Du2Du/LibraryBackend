import Fastify from "fastify";
import * as dotenv from "dotenv";
import fastifyCors from "@fastify/cors";
import { UserControler } from "./Controllers";
dotenv.config();

const app = async () => {
  const fastify = Fastify({
    logger: true,
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
