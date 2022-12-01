import { FastifyInstance } from "fastify";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "http-errors-enhanced";
import { CreateRating, UpdateRating, UserToken } from "../../../Types";
import { ratingDAO } from "../../DAOs";
import { BookBO } from "../BookBO";
import { UserBO } from "../UserBO";

export const RatingBO = (fastify: FastifyInstance) => {
  const { me } = UserBO(fastify);
  const { getById, updateBook } = BookBO(fastify);

  const updateStarsAverageBook = async (bookId: number, newStars: number) => {
    const book = await getById(bookId);
    const currentStarsAverage = book.starsAverage;
    const starsCount = await ratingDAO.count({
      where: {
        bookId,
      },
    });
    const newStarsAverage = (currentStarsAverage + newStars) / starsCount;
    await updateBook(bookId, { ...book, starsAverage: newStarsAverage });
  };

  const createRating = async (
    ratingData: CreateRating,
    userToken: UserToken
  ) => {
    const { bookId, userRatingId } = ratingData;
    const currentUser = await me(userToken);
    if (currentUser.id !== userRatingId)
      throw new ForbiddenError(
        "Você não pode criar uma avaliação com outro usuário!"
      );
    await getById(bookId);
    const rating = await ratingDAO.create({ data: ratingData });
    await updateStarsAverageBook(bookId, ratingData.stars);
    return rating;
  };

  const getRatingsFromBookId = async (bookId: number) => {
    await getById(bookId);
    const ratings = await ratingDAO.findMany({
      where: {
        bookId,
      },
    });
    return ratings;
  };

  const getAllRatings = async () => {
    return ratingDAO.findMany();
  };

  const deleteRating = async (ratingId: number, userToken: UserToken) => {
    const currentUser = await me(userToken);
    const rating = await ratingDAO.findUnique({
      where: {
        id: ratingId,
      },
    });
    if (!rating) throw new NotFoundError("Avaliação não encontrada.");
    const book = await getById(rating.bookId);

    if (
      rating?.userRatingId !== currentUser.id &&
      book.sallerId !== currentUser.id
    )
      throw new ForbiddenError("Usuário não autorizado!");

    await ratingDAO.delete({ where: { id: rating.id } });
    return "Avaliação deletada com sucesso!";
  };

  const getRatingById = async (ratingId: number) => {
    const rating = await ratingDAO.findUnique({
      where: {
        id: Number(ratingId),
      },
    });
    if (!rating) throw new NotFoundError("Avaliação não encontrada");
    return rating;
  };

  const updateRating = async (
    ratingId: number,
    updateData: UpdateRating,
    userToken: UserToken
  ) => {
    const { bookId, userRatingId } = updateData;
    const currentUser = await me(userToken);
    if (currentUser.id !== userRatingId)
      throw new ForbiddenError(
        "Você não pode alterar uma avaliação com outro usuário!"
      );
    await getById(bookId);
    if (updateData.stars !== (await getRatingById(ratingId)).stars)
      throw new BadRequestError("Você não pode alterar as estrelas.");

    const newRating = await ratingDAO.update({
      data: updateData,
      where: {
        id: ratingId,
      },
    });
    return newRating;
  };

  return {
    createRating,
    getRatingsFromBookId,
    updateRating,
    deleteRating,
    getAllRatings,
  };
};
