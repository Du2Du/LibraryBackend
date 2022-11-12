import Fastify from "fastify";
import * as dotenv from "dotenv";
import fastifyPg from "@fastify/postgres";
import fastifyCors from "@fastify/cors";

dotenv.config();

const app = async () => {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(fastifyCors, {
    origin: true,
  });

  fastify.register(fastifyPg, {
    connectionString: process.env.DATABASE_URL,
  });

  fastify.listen({ port: 8099 });
};

app();
