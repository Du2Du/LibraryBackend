import { FastifyInstance } from "fastify";
import { UserBO } from "../../Model/BOs";
import { UserProps } from "../../Types";

export const UserControler = async (fastify: FastifyInstance) => {
  const { createUser, userLogin, refreshToken, me, updateUser } = UserBO();
  fastify.post("/", createUser);
  fastify.post("/login", userLogin);
  fastify.get("/me", me);
  fastify.get("/refresh-token", refreshToken);
  fastify.put("/update/:userId", updateUser);
};
