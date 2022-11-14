import Fastify, { FastifyRequest } from "fastify";
import * as dotenv from "dotenv";
import fastifyPg from "@fastify/postgres";
import fastifyCors from "@fastify/cors";
import { Client } from "pg";

dotenv.config();

const client = new Client({
  user: "postgres",
  password: process.env.PASSWORD,
  host: "localhost",
  port: 5432,
  database: process.env.DATABASE_URL,
});
const app = async () => {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(fastifyCors, {
    origin: true,
  });

  fastify.register(fastifyPg, client);

  fastify.post("/livro", (req: FastifyRequest, res) => {
    fastify.pg.query(
      "CREATE TABLE IF NOT EXISTS BOOK ( id INTEGER PRIMARY KEY, name VARCHAR)",
      [req.body.name],
      (err, result) => {
        res.send({
          result,
          err,
        });
      }
    );
  });

  fastify.listen({ port: 8099 });
};

app();
