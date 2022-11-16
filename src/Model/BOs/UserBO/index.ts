import { FastifyReply, FastifyRequest } from "fastify";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "http-errors-enhanced";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import { userDAO } from "../../DAOs";
import { CreateUserProps, CreateUserResponse } from "../../../Types";

export const UserBO = () => {
  const verifyUserByEmail = async (email: string) => {
    const existsUserEmail = await userDAO.findUnique({
      where: {
        email,
      },
    });
    return existsUserEmail;
  };

  const verifyUserByCpf = async (cpf: string) => {
    const existsUserCpf = await userDAO.findUnique({
      where: {
        cpf,
      },
    });
    return existsUserCpf;
  };

  const createAccessToken = (email: string) => {
    const token = jwt.sign(
      { foo: "bar", email },
      process.env.TOKEN_SECRET ?? "",
      { algorithm: "ES512", expiresIn: "5h" }
    );

    return token;
  };

  const createRefreshToken = (email: string) => {
    const refreshToken = jwt.sign(
      { foo: "bar", email },
      process.env.TOKEN_SECRET ?? "",
      { algorithm: "ES512", expiresIn: "90 days" }
    );
    return refreshToken;
  };

  const createUser = async (req: FastifyRequest, res: FastifyReply) => {
    const userSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      cpf: z.string().length(11),
      password: z.string().min(6),
    });

    const userData = userSchema.parse(req.body);
    const { email, cpf, password } = userData;

    if (await verifyUserByEmail(email))
      throw new ConflictError("Usuário com email já cadastrado!");
    if (await verifyUserByCpf(cpf))
      throw new ConflictError("Usuário com cpf já cadastrado!");
    if (!/^[0-9]+$/.test(cpf))
      throw new BadRequestError("O CPF deve conter apenas números.");

    const newPassword = bcrypt.hash(password, 9);
    const user: CreateUserResponse = await userDAO.create({
      data: { ...userData, password: await newPassword },
    });
    delete user.password;
    return user;
  };

  const userLogin = async (req: FastifyRequest, res: FastifyReply) => {
    const userSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const userData = userSchema.parse(req.body);
    const { email } = userData;
    const user = await verifyUserByEmail(email);

    if (!user) throw new NotFoundError("Usuário não encontrado.");

    const accessToken = createAccessToken(email);
    const refreshToken = createRefreshToken(email);

    req.headers["authorization"] = "Bearer " + accessToken;

    console.log("----------------");
    console.log(accessToken);

    return;
  };

  return { createUser, userLogin };
};
