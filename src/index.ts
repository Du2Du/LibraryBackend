import Fastify from "fastify";
import * as dotenv from "dotenv";
import fastifyCors from "@fastify/cors";
dotenv.config();

const app = async () => {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(fastifyCors, {
    origin: true,
  });

  fastify.listen({ port: 8099 });
};

app();
