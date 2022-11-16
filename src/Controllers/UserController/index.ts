import { FastifyInstance } from "fastify";
import { UserBO } from "../../Model/BOs";

export const UserControler = async (fastify: FastifyInstance) => {
  const { createUser, userLogin, refreshToken, me } = UserBO();
  fastify.post("/", createUser);
  fastify.post("/login", userLogin);
  fastify.get("/me", me);
  fastify.get("/refresh-token", refreshToken);
};
