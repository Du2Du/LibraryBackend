import { FastifyInstance } from "fastify";
import { UserBO } from "../../Model/BOs";

export const UserControler = async (fastify: FastifyInstance) => {
  const { createUser, userLogin, refreshToken, me, updateUser } = UserBO();
  fastify.post("/", createUser);
  fastify.post(
    "/login",
    {
      onResponse: [
        (req, res) => {
          res.header("set-cookie", res.cookies.accessToken);
          res.header("set-cookie", res.cookies.refreshToken);
        },
      ],
    },
    userLogin
  );
  fastify.get("/me", me);
  fastify.get("/refresh-token", refreshToken);
  fastify.put("/update/:userId", updateUser);
};
