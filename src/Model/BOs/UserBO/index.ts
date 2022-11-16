import { FastifyReply, FastifyRequest } from "fastify";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
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

  const createToken = (id: number, isAccessToken = true) => {
    const token = jwt.sign({ id }, process.env.TOKEN_SECRET ?? "", {
      algorithm: "HS512",
      expiresIn: isAccessToken ? "5h" : "90 days",
    });
    return token;
  };

  const setCookie = (
    res: FastifyReply,
    cookieName: string,
    cookieValue: string
  ) => {
    res.setCookie(cookieName, cookieValue);
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
    const userLogged = await verifyUserByEmail(email);
    if (!userLogged?.id) throw new NotFoundError("Usuário não encontrado.");

    const { id, password } = userLogged;
    const passwordVerify = await bcrypt.compare(userData.password, password);
    if (!passwordVerify) throw new UnauthorizedError("Senha inválida.");

    const accessToken = createToken(id);
    const refreshToken = createToken(id, false);
    setCookie(res, "accessToken", accessToken);
    setCookie(res, "refreshToken", refreshToken);
    res.send("Usuário logado com sucesso!");
  };

  return { createUser, userLogin };
};
