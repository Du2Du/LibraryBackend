import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ConflictError, NotFoundError } from "http-errors-enhanced";
import { bookDAO } from "../../DAOs";
import { createBookSchema } from "../../DTOs";
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

  const createBook = async (req: FastifyRequest, res: FastifyReply) => {
    const createBookData = createBookSchema.parse(req.body);
    const { bookName } = createBookData;
    const currentUser = await me(req, res);

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
    return res.send(createdBook);
  };

  const getAllBooks = async (req: FastifyRequest, res: FastifyReply) => {
    const allBooks = await bookDAO.findMany();

    return res.send(allBooks);
  };

  const getById = async (
    req: FastifyRequest<{ Params: { bookId: number } }>,
    res: FastifyReply
  ) => {
    const { bookId } = req.params;

    const book = await bookDAO.findUnique({
      where: {
        id: Number(bookId),
      },
    });
    if (!book) throw new NotFoundError("Livro não encontrado");
    return res.send(book);
  };

  const updateBook = async (
    req: FastifyRequest<{ Params: { bookId: number } }>,
    res: FastifyReply
  ) => {
    const bookId = Number(req.params.bookId);
    const updateBook = createBookSchema.parse(req.body);
    const newUpdatedBook = await bookDAO.update({
      data: updateBook,
      where: {
        id: bookId,
      },
    });

    return res.send(newUpdatedBook);
  };

  const deleteBook = async (
    req: FastifyRequest<{ Params: { bookId: number } }>,
    res: FastifyReply
  ) => {
    const bookId = Number(req.params.bookId);
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
