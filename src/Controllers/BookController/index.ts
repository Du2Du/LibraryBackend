import { FastifyInstance, FastifyRequest } from "fastify";
import { BookBO } from "../../Model/BOs/BookBO";
import { createBookSchema } from "../../Model/DTOs";

export const BookController = async (fastify: FastifyInstance) => {
  const { createBook, getAllBooks, getById, updateBook, deleteBook } =
    BookBO(fastify);

  fastify.post("/", (req, res) => {
    const createBookData = createBookSchema.parse(req.body);
    createBook(createBookData, req.user, res);
  });

  fastify.get("/", (req, res) => {
    getAllBooks(res);
  });

  fastify.get(
    "/:bookId",
    (req: FastifyRequest<{ Params: { bookId: number } }>, res) => {
      getById(Number(req.params.bookId), res);
    }
  );

  fastify.put(
    "/:bookId",
    (req: FastifyRequest<{ Params: { bookId: number } }>, res) => {
      const updateBookData = createBookSchema.parse(req.body);
      updateBook(Number(req.params.bookId), updateBookData, res);
    }
  );

  fastify.delete(
    "/:bookId",
    (req: FastifyRequest<{ Params: { bookId: number } }>, res) => {
      const bookId = Number(req.params.bookId);
      deleteBook(bookId, res);
    }
  );
};
