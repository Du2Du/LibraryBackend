import { FastifyInstance } from "fastify";
import { UserBO } from "../../Model/BOs";

export const UserControler = async (fastify: FastifyInstance) => {
  const { createUser, userLogin, refreshToken } = UserBO();
  fastify.post("/", createUser);
  fastify.post("/login", userLogin);
  fastify.get("/refresh-token", refreshToken);
};
