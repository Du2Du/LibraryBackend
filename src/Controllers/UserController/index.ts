import { FastifyInstance } from "fastify";
import { CreateUserProps } from "../../Types";

export const UserControler = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: CreateUserProps }>("/", async (req, res) => {
    const userData = req.body;
    const { password } = userData;

    if (password.trim().length < 6)
      return res.status(400).send({
        error: "A senha deve conter 6 ou mais dígitos.",
      });
  });
};
