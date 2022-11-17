import { FastifyReply, FastifyRequest } from "fastify";
import { ConflictError } from "http-errors-enhanced";
import { bookDAO } from "../../DAOs";
import { createBookSchema } from "../../DTOs";
import { UserBO } from "../UserBO";

export const BookBO = () => {
  const { me } = UserBO();

  const findBookFromNameWithSallerId = async (
    name: string,
    sallerId: number
  ) => {
    const book = await bookDAO.findFirst({
      where: {
        bookName: name,
        sallerId: sallerId,
      },
    });
    return book;
  };

  const createBook = async (req: FastifyRequest, res: FastifyReply) => {
    const createBookData = createBookSchema.parse(req.body);
    const { bookName } = createBookData;
    const currentUser = await me(req, res);

    if (await findBookFromNameWithSallerId(bookName, currentUser.id))
      throw new ConflictError(
        "Livro já cadastrado, a melhor opção seria aumentar a quantidade."
      );
  };

  return {
    createBook,
  };
};
