import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const UserBO = () => {
  const createUser = async (req: FastifyRequest, res: FastifyReply) => {
    const userSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      cpf: z.string().length(11),
      password: z.string().min(6),
    });

    const userData = userSchema.parse(req.body);
    const { password } = userData;

    if (password.trim().length < 6)
      return res.status(400).send({
        error: "A senha deve conter 6 ou mais dígitos.",
      });
  };

  return { createUser };
};
