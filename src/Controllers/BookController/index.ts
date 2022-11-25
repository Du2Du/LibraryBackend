import { FastifyInstance } from "fastify";
import { BookBO } from "../../Model/BOs/BookBO";

export const BookController = async (fastify: FastifyInstance) => {
  const { createBook, getAllBooks, getById, updateBook, deleteBook } =
    BookBO(fastify);

  fastify.post("/", createBook);
  fastify.get("/", getAllBooks);
  fastify.get("/:bookId", getById);
  fastify.put("/:bookId", updateBook);
  fastify.delete("/:bookId", deleteBook);
};
