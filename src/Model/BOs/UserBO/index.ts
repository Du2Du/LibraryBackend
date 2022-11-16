import bcrypt from "bcrypt";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "http-errors-enhanced";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { CreateUserResponse } from "../../../Types";
import { userDAO } from "../../DAOs";

export const UserBO = () => {
  const findUserByEmail = async (email: string) => {
    const existsUserEmail = await userDAO.findUnique({
      where: {
        email,
      },
    });
    return existsUserEmail;
  };

  const findUserByCpf = async (cpf: string) => {
    const existsUserCpf = await userDAO.findUnique({
      where: {
        cpf,
      },
    });
    return existsUserCpf;
  };

  const findUserById = async (id: number) => {
    const user = await userDAO.findUnique({
      where: {
        id,
      },
    });
    return user;
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

  const returnIdWithCookie = (cookie: string) => {
    const token = jwt.decode(cookie);
    if (typeof token === "string" || token === null)
      throw new BadRequestError("Ocorreu um erro.");

    return token.id;
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

    if (await findUserByEmail(email))
      throw new ConflictError("Usuário com email já cadastrado!");
    if (await findUserByCpf(cpf))
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
    const userLogged = await findUserByEmail(email);
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

  const refreshToken = async (req: FastifyRequest, res: FastifyReply) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new NotFoundError("Cookie não existente.");

    const tokenValidate = jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET ?? ""
    );

    if (!tokenValidate) throw new UnauthorizedError("Token inválido.");
    const userId = returnIdWithCookie(refreshToken);
    const accessToken = createToken(userId);
    setCookie(res, "accessToken", accessToken);
    res.send("Token atualizado com sucesso.");
  };

  const me = async (req: FastifyRequest, res: FastifyReply) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) throw new UnauthorizedError("Usuário não autorizado.");

    const validateToken = jwt.verify(
      accessToken,
      process.env.TOKEN_SECRET ?? ""
    );
    if (!validateToken) throw new UnauthorizedError("Token inválido.");

    const userId = returnIdWithCookie(accessToken);
    const user: CreateUserResponse | null = await findUserById(userId);
    delete user?.password;
    return user;
  };

  return { createUser, userLogin, refreshToken, me };
};
