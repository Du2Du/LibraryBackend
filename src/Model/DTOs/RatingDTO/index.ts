import { z } from "zod";

export const createRatingSchema = z.object({
  bookId: z.number(),
  userRatingId: z.number(),
  description: z.string(),
});
