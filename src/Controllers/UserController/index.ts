import { FastifyInstance } from "fastify";

export const UserControler = async (fastify: FastifyInstance) => {
  fastify.post("/", async () => ({ message: "Ola" }));
};
