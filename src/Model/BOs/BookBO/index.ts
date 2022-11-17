import { FastifyReply, FastifyRequest } from "fastify";

export const BookBO = () => {
  const createBook = async (req: FastifyRequest, res: FastifyReply) => {};

  return {
    createBook,
  };
};
