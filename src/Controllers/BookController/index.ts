import { FastifyInstance } from "fastify";
import { BookBO } from "../../Model/BOs/BookBO";

export const BookController = async (fastify: FastifyInstance) => {
  const { createBook } = BookBO();

  fastify.post("/create", createBook);
};
