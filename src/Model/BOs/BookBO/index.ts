import { FastifyInstance, FastifyReply } from "fastify";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "http-errors-enhanced";
import { CreateBook, UserToken } from "../../../Types";
import { bookDAO } from "../../DAOs";
import { UserBO } from "../UserBO";

export const BookBO = (fastify: FastifyInstance) => {
  const { me } = UserBO(fastify);

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

  const createBook = async (
    createBookData: CreateBook,
    userToken: UserToken
  ) => {
    const { bookName, price } = createBookData;
    if (price < 0) throw new BadRequestError("Insira um preço válido!");
    const currentUser = await me(userToken);

    if (await findBookFromNameWithSallerId(bookName, currentUser.id))
      throw new ConflictError(
        "Livro já cadastrado, a melhor opção seria aumentar a quantidade."
      );
    const createdBook = await bookDAO.create({
      data: {
        ...createBookData,
        sallerId: currentUser.id,
      },
    });
    return createdBook;
  };

  const getAllBooks = async () => {
    const allBooks = await bookDAO.findMany();
    return allBooks;
  };

  const getById = async (bookId: number) => {
    const book = await bookDAO.findUnique({
      where: {
        id: Number(bookId),
      },
    });
    if (!book) throw new NotFoundError("Livro não encontrado");
    return book;
  };

  const updateBook = async (bookId: number, updateBook: CreateBook) => {
    const newUpdatedBook = await bookDAO.update({
      data: updateBook,
      where: {
        id: bookId,
      },
    });
    return newUpdatedBook;
  };

  const deleteBook = async (bookId: number, res: FastifyReply) => {
    await bookDAO.delete({
      where: {
        id: bookId,
      },
    });
    return res.send("Livro deletado com sucesso!");
  };

  return {
    createBook,
    getAllBooks,
    getById,
    updateBook,
    deleteBook,
  };
};
