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
    userToken: UserToken,
    res: FastifyReply
  ) => {
    const { bookId, userRatingId } = ratingData;
    const currentUser = await me(userToken);
    if (currentUser.id !== userRatingId)
      throw new ForbiddenError(
        "Você não pode criar uma avaliação com outro usuário!"
      );
    const book = await getById(bookId, res);
    if (!book) throw new NotFoundError("Livro não encontrado");
    const rating = await ratingDAO.create({ data: ratingData });
    return res.send(rating);
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
    if (!(await getById(bookId, res)))
      throw new NotFoundError("Livro não encontrado");
    const newRating = await ratingDAO.update({
      data: updateData,
      where: {
        id,
      },
    });
    return res.send(newRating);
  };

  return { createRating };
};
