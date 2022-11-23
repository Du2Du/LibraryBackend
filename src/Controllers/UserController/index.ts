import { FastifyInstance } from "fastify";
import { UserBO } from "../../Model/BOs";
import { authenticate } from "../../Utils/authenticate";

export const UserControler = async (fastify: FastifyInstance) => {
  const { createUser, userLogin, refreshToken, me, updateUser } =
    UserBO(fastify);
  fastify.post("/", createUser);
  fastify.post("/login", userLogin);
  fastify.get(
    "/me",
    {
      onRequest: [authenticate],
    },
    me
  );
  fastify.get("/refresh-token", refreshToken);
  fastify.put("/update/:userId", updateUser);
};
