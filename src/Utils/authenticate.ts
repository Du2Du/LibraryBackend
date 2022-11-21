import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export const authenticate = async (req: FastifyRequest, res: FastifyReply) => {
  await req.jwtVerify();
};
