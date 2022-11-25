import { FastifyInstance, FastifyRequest } from "fastify";
import { UserBO } from "../../Model/BOs";
import {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
} from "../../Model/DTOs";

export const UserControler = async (fastify: FastifyInstance) => {
  const { createUser, userLogin, refreshToken, me, updateUser, getById } =
    UserBO(fastify);

  fastify.post("/", (req) => {
    const userData = createUserSchema.parse(req.body);
    createUser(userData);
  });

  fastify.post("/login", (req, res) => {
    const userData = loginUserSchema.parse(req.body);
    userLogin(userData, res);
  });

  fastify.get("/me", (req) => {
    me(req.user);
  });

  fastify.get("/refresh-token", (req, res) => {
    const refreshTokenString = req.cookies.refreshToken;
    refreshToken(res, refreshTokenString);
  });

  fastify.put(
    "/:userId",
    (req: FastifyRequest<{ Params: { userId: number } }>, res) => {
      const updateUserData = updateUserSchema.parse(req.body);
      const userId = Number(req.params.userId);
      updateUser(req.user, userId, updateUserData, res);
    }
  );

  fastify.get(
    "/:userId",
    (req: FastifyRequest<{ Params: { userId: number } }>, res) => {
      const userId = Number(req.params.userId);
      getById(userId, res);
    }
  );
};
