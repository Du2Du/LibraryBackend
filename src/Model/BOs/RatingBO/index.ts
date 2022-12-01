import { FastifyInstance, FastifyReply } from "fastify";
import { ForbiddenError, NotFoundError } from "http-errors-enhanced";
import { CreateRating, Rating, UserToken } from "../../../Types";
import { ratingDAO } from "../../DAOs";
import { BookBO } from "../BookBO";
import { UserBO } from "../UserBO";

export const RatingBO = (fastify: FastifyInstance) => {
  const { me } = UserBO(fastify);
  const { getById } = BookBO(fastify);

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
    return rating;
  };

  const getRatingsFromBookId = async (bookId: number) => {
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

  const updateRating = async (
    updateData: Rating,
    userToken: UserToken,
    res: FastifyReply
  ) => {
    const { bookId, userRatingId, id } = updateData;
    const currentUser = await me(userToken);
    if (currentUser.id !== userRatingId)
      throw new ForbiddenError(
        "Você não pode alterar uma avaliação com outro usuário!"
      );
    await getById(bookId);
    const newRating = await ratingDAO.update({
      data: updateData,
      where: {
        id,
      },
    });
    return res.send(newRating);
  };

  return {
    createRating,
    getRatingsFromBookId,
    updateRating,
    deleteRating,
    getAllRatings,
  };
};
