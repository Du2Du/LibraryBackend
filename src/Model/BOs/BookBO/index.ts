import { FastifyReply, FastifyRequest } from "fastify";
import { createBookSchema } from "../../DTOs";

export const BookBO = () => {
  const createBook = async (req: FastifyRequest, res: FastifyReply) => {
    const createBookData = createBookSchema.parse(req.body);
  };

  return {
    createBook,
  };
};
