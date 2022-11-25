import bcrypt from "bcrypt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "http-errors-enhanced";
import {
  CreateUserProps,
  UserDTO,
  UserLogin,
  UserUpdate,
} from "../../../Types";
import { userDAO } from "../../DAOs";
import {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
} from "../../DTOs";

export const UserBO = (fastify: FastifyInstance) => {
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
    const token = fastify.jwt.sign(
      { id },
      {
        algorithm: "HS512",
        sub: String(id),
        expiresIn: isAccessToken
          ? process.env.ACCESS_TOKEN_EXPIRES
          : process.env.REFRESH_TOKEN_EXPIRES,
      }
    );
    return token;
  };

  const setCookie = (
    res: FastifyReply,
    cookieName: string,
    cookieValue: string
  ) => {
    res.setCookie(cookieName, cookieValue);
  };

  const returnIdFromCookie = (token: any) => {
    if (typeof token === "string" || token === null)
      throw new BadRequestError("Ocorreu um erro.");
    return token.id;
  };

  const createUser = async (userData: CreateUserProps) => {
    const { email, cpf, password } = userData;

    if (await findUserByEmail(email))
      throw new ConflictError("Usuário com email já cadastrado!");
    if (await findUserByCpf(cpf))
      throw new ConflictError("Usuário com cpf já cadastrado!");
    if (!/^[0-9]+$/.test(cpf))
      throw new BadRequestError("O CPF deve conter apenas números.");

    const newPassword = await bcrypt.hash(password, 9);
    const user: UserDTO = await userDAO.create({
      data: { ...userData, password: newPassword },
    });
    return user;
  };

  const userLogin = async (userData: UserLogin, res: FastifyReply) => {
    const { email } = userData;
    const userLogged = await findUserByEmail(email);
    if (!userLogged?.id) throw new NotFoundError("Usuário não encontrado.");
    const { id, password } = userLogged;
    const passwordVerify = await bcrypt.compare(userData.password, password);
    if (!passwordVerify) throw new UnauthorizedError("Senha inválida.");

    const accessToken = createToken(id);
    const refreshToken = createToken(id, false);
    setCookie(res, "refreshToken", refreshToken);
    return res.send({ accessToken });
  };

  const refreshToken = async (res: FastifyReply, refreshToken?: string) => {
    if (!refreshToken) throw new NotFoundError("Cookie não existente.");
    const tokenValidate = fastify.jwt.verify(refreshToken);
    if (!tokenValidate) throw new UnauthorizedError("Token inválido.");
    const userId = returnIdFromCookie(fastify.jwt.decode(refreshToken));
    createToken(userId);
    return res.send("Token atualizado coFm sucesso.");
  };

  const me = async (userToken: string | object | Buffer) => {
    const userId = returnIdFromCookie(userToken);
    const user: UserDTO | null = await findUserById(userId);
    if (user === null)
      throw new UnauthorizedError(
        "Ocorreu um erro, tente realizar o login novamente."
      );
    delete user?.password;
    return user;
  };

  const updateUser = async (
    userToken: string | object | Buffer,
    userId: number,
    updateUserData: UserUpdate,
    res: FastifyReply
  ) => {
    const { email } = updateUserData;
    const currentUser = await me(userToken);

    if (currentUser?.id !== userId)
      throw new ForbiddenError("Usuário não permitido.");
    if ((await findUserByEmail(email)) && email !== currentUser.email)
      throw new ConflictError("Usuário com email já utilizado.");
    if (!(await findUserById(userId)))
      throw new NotFoundError("Usuário não encontrado.");

    const user: UserDTO | null = await userDAO.update({
      where: {
        id: userId,
      },
      data: { ...updateUserData },
    });
    delete user?.password;
    return res.send(user);
  };

  const getById = async (userId: number, res: FastifyReply) => {
    const user = await userDAO.findUnique({
      where: {
        id: Number(userId),
      },
    });
    if (!user) throw new NotFoundError("Usuário não encontrado");
    return res.send(user);
  };

  return { createUser, userLogin, refreshToken, me, updateUser, getById };
};
