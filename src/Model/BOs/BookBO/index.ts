import { FastifyInstance, FastifyReply } from "fastify";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "http-errors-enhanced";
import { CreateBook, UpdateBook, UserToken } from "../../../Types";
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
      throw new ConflictError("Livro já cadastrado.");
    const createdBook = await bookDAO.create({
      data: {
        ...createBookData,
        sallerId: currentUser.id,
        starsAverage: 0,
      },
    });
    return createdBook;
  };

  const getAllBooks = async (page = 0, perPage = 10) => {
    const skipBooks = page * 3;
    const allBooks = await bookDAO.findMany({ skip: skipBooks, take: perPage });
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

  const updateBook = async (bookId: number, updateBook: UpdateBook) => {
    const newUpdatedBook = await bookDAO.update({
      data: { ...updateBook, ratings: undefined },
      where: {
        id: bookId,
      },
    });
    return newUpdatedBook;
  };

  const deleteBook = async (bookId: number) => {
    await bookDAO.delete({
      where: {
        id: bookId,
      },
    });
    return "Livro deletado com sucesso!";
  };

  return {
    createBook,
    getAllBooks,
    getById,
    updateBook,
    deleteBook,
  };
};
