import { FastifyInstance } from "fastify";
import { BookBO } from "../../Model/BOs/BookBO";

export const BookController = async (fastify: FastifyInstance) => {
  const { createBook, getAllBooks, getById } = BookBO(fastify);

  fastify.post("/", createBook);
  fastify.get("/", getAllBooks);
  fastify.get("/:bookId", getById);
};
