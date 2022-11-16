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
    if (existsUserEmail) return true;
    return false;
  };

  const verifyUserByCpf = async (cpf: string) => {
    const existsUserCpf = await userDAO.findUnique({
      where: {
        cpf,
      },
    });
    if (existsUserCpf) return true;
    return false;
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
    const user = await userDAO.create({
      data: { ...userData, password: await newPassword },
    });

    const newUser: CreateUserResponse = user;
    delete newUser.password;
    return newUser;
  };

  const userLogin = async (req: FastifyRequest, res: FastifyReply) => {
    const userSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const userData = userSchema.parse(req.body);
    const { email } = userData;

    if (!verifyUserByEmail(email))
      throw new NotFoundError("Usuário não encontrado.");
  };

  return { createUser, userLogin };
};
