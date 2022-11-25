import { z } from "zod";

export const createBookSchema = z.object({
  bookName: z.string(),
  authorName: z.string(),
  pages: z.number(),
  chapters: z.number(),
  publishingCompanyName: z.string(),
  linguage: z.string(),
  price: z.number(),
  quantity: z.number(),
});
