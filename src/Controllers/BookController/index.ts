import { FastifyInstance, FastifyRequest } from "fastify";
import { RatingBO } from "../../Model/BOs";
import { BookBO } from "../../Model/BOs/BookBO";
import {
  createBookSchema,
  createRatingSchema,
  updateRatingSchema,
} from "../../Model/DTOs";
import { Rating } from "../../Types";

export const BookController = async (fastify: FastifyInstance) => {
  const { createBook, getAllBooks, getById, updateBook, deleteBook } =
    BookBO(fastify);
  const {
    createRating,
    getRatingsFromBookId,
    updateRating,
    deleteRating,
    getAllRatings,
  } = RatingBO(fastify);

  fastify.post("/", (req, res) => {
    const createBookData = createBookSchema.parse(req.body);
    return createBook(createBookData, req.user);
  });

  fastify.get("/", () => {
    return getAllBooks();
  });

  fastify.get(
    "/:bookId",
    (req: FastifyRequest<{ Params: { bookId: number } }>) => {
      return getById(Number(req.params.bookId));
    }
  );

  fastify.put(
    "/:bookId",
    (req: FastifyRequest<{ Params: { bookId: number } }>) => {
      const updateBookData = createBookSchema.parse(req.body);
      return updateBook(Number(req.params.bookId), updateBookData);
    }
  );

  fastify.delete(
    "/:bookId",
    (req: FastifyRequest<{ Params: { bookId: number } }>, res) => {
      const bookId = Number(req.params.bookId);
      return deleteBook(bookId);
    }
  );

  fastify.post("/rating", (req, res) => {
    const ratingData = createRatingSchema.parse(req.body);
    return createRating(ratingData, req.user);
  });

  fastify.get(
    "/ratings/:bookId",
    (req: FastifyRequest<{ Params: { bookId: number } }>) => {
      const bookId = Number(req.params.bookId);
      return getRatingsFromBookId(bookId);
    }
  );

  fastify.put(
    "/rating/:ratingId",
    (req: FastifyRequest<{ Params: { ratingId: number } }>) => {
      const ratingId = Number(req.params.ratingId);
      const ratingData = updateRatingSchema.parse(req.body);
      return updateRating(ratingId, ratingData, req.user);
    }
  );

  fastify.get("/ratings", () => {
    return getAllRatings();
  });

  fastify.delete(
    "/rating/:ratingId",
    (req: FastifyRequest<{ Params: { ratingId: number } }>) => {
      const ratingId = Number(req.params.ratingId);
      return deleteRating(ratingId, req.user);
    }
  );
};
