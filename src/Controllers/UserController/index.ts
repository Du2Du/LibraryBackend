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
    return createUser(userData);
  });

  fastify.post("/login", (req, res) => {
    const userData = loginUserSchema.parse(req.body);
    return userLogin(userData, res);
  });

  fastify.get("/me", (req) => {
    return me(req.user);
  });

  fastify.get("/refresh-token", (req, res) => {
    const refreshTokenString = req.cookies.refreshToken;
    return refreshToken(refreshTokenString);
  });

  fastify.put(
    "/:userId",
    (req: FastifyRequest<{ Params: { userId: number } }>, res) => {
      const updateUserData = updateUserSchema.parse(req.body);
      const userId = Number(req.params.userId);
      return updateUser(req.user, userId, updateUserData);
    }
  );

  fastify.get(
    "/:userId",
    (req: FastifyRequest<{ Params: { userId: number } }>, res) => {
      const userId = Number(req.params.userId);
      return getById(userId);
    }
  );
};
