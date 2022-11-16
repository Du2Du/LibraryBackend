import { FastifyInstance } from "fastify";
import { UserBO } from "../../Model/BOs";

export const UserControler = async (fastify: FastifyInstance) => {
  const { createUser, userLogin } = UserBO();
  fastify.post("/", createUser);
  fastify.post("/login", userLogin);
};
