import { FastifyInstance } from "fastify";
import { UserBO } from "../../BOs";

export const UserControler = async (fastify: FastifyInstance) => {
  const { createUser } = UserBO();
  fastify.post("/", createUser);
};
