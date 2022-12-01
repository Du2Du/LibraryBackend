import { z } from "zod";

export const createRatingSchema = z.object({
  bookId: z.number(),
  userRatingId: z.number(),
  stars: z.number(),
  description: z.string(),
});

export const updateRatingSchema = z.object({
  bookId: z.number(),
  id: z.number(),
  stars: z.number(),
  userRatingId: z.number(),
  description: z.string(),
});
