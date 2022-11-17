import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const BookBO = () => {
  const createBook = async (req: FastifyRequest, res: FastifyReply) => {};

  return {
    createBook,
  };
};
