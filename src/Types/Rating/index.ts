export interface Rating {
  bookId: number;
  id: number;
  userRatingId: number;
  description: string;
}
export interface CreateRating extends Omit<Rating, "id"> {}
