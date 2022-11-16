import { FastifyReply, FastifyRequest } from "fastify";
import { BadRequestError, ConflictError } from "http-errors-enhanced";
import { z } from "zod";
import { userDAO } from "../../DAOs";

export const UserBO = () => {
  const createUser = async (req: FastifyRequest, res: FastifyReply) => {
    const userSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      cpf: z.string().length(11),
      password: z.string().min(6),
    });

    const userData = userSchema.parse(req.body);
    const { email, cpf } = userData;
    const existsUserEmail = await userDAO.findUnique({
      where: {
        email,
      },
    });
    const existsUserCpf = await userDAO.findUnique({
      where: {
        cpf,
      },
    });
    if (existsUserEmail)
      throw new ConflictError("Usuário com email já cadastrado!");
    if (existsUserCpf)
      throw new ConflictError("Usuário com cpf já cadastrado!");

    if (!/^[0-9]+$/.test(cpf))
      throw new BadRequestError("O CPF deve conter apenas números.");
  };

  return { createUser };
};
