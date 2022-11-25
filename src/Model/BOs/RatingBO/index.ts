import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ForbiddenError } from "http-errors-enhanced";
import { createkRating } from "../../DTOs";
import { UserBO } from "../UserBO";

export const RatingBO = (fastify: FastifyInstance) => {
  const { me } = UserBO(fastify);

  const createRating = async (req: FastifyRequest, res: FastifyReply) => {
    const ratingData = createkRating.parse(req.body);
    const { bookId, userRatingId } = ratingData;
    const currentUser = await me(req, res);
    if (currentUser.id !== userRatingId)
      throw new ForbiddenError(
        "Você não pode criar uma avaliação com outro usuário!"
      );
  };

  return { createRating };
};
