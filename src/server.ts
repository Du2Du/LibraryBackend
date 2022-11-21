import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import * as dotenv from "dotenv";
import fastifyCors from "@fastify/cors";
import { UserControler, BookController } from "./Controllers";
import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
dotenv.config();

let fastify: FastifyInstance;
const app = async () => {
  fastify = Fastify({
    logger: true,
  });

  fastify.register(fastifyCookie, {
    parseOptions: {
      httpOnly: true,
      secure: true,
    },
    hook: "preHandler",
  } as FastifyCookieOptions);

  fastify.register(fastifyJwt, {
    secret: process.env.TOKEN_SECRET ?? "",
  });

  await fastify.register(fastifyCors, {
    origin: true,
  });

  fastify.decorate(
    "authorization",
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await req.jwtVerify();
      } catch (err) {
        res.send(err);
      }
    }
  );

  fastify.register(UserControler, {
    prefix: "/user",
  });
  fastify.register(BookController, {
    prefix: "/book",
  });

  fastify.listen({ port: 8099 });
};
export { fastify };
app();
