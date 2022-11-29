import { FastifyInstance, FastifyRequest } from "fastify";
import { RatingBO } from "../../Model/BOs";
import { BookBO } from "../../Model/BOs/BookBO";
import { createBookSchema, createRatingSchema } from "../../Model/DTOs";

export const BookController = async (fastify: FastifyInstance) => {
  const { createBook, getAllBooks, getById, updateBook, deleteBook } =
    BookBO(fastify);
  const { createRating } = RatingBO(fastify);

  fastify.post("/", (req, res) => {
    const createBookData = createBookSchema.parse(req.body);
    return createBook(createBookData, req.user);
  });

  fastify.get("/", (req, res) => {
    return getAllBooks();
  });

  fastify.get(
    "/:bookId",
    (req: FastifyRequest<{ Params: { bookId: number } }>, res) => {
      return getById(Number(req.params.bookId));
    }
  );

  fastify.put(
    "/:bookId",
    (req: FastifyRequest<{ Params: { bookId: number } }>, res) => {
      const updateBookData = createBookSchema.parse(req.body);
      return updateBook(Number(req.params.bookId), updateBookData);
    }
  );

  fastify.delete(
    "/:bookId",
    (req: FastifyRequest<{ Params: { bookId: number } }>, res) => {
      const bookId = Number(req.params.bookId);
      return deleteBook(bookId, res);
    }
  );

  fastify.post("/rating", (req, res) => {
    const ratingData = createRatingSchema.parse(req.body);
    return createRating(ratingData, req.user, res);
  });
};
