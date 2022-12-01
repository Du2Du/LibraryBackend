export interface UpdateRating {
  bookId: number;
  id: number;
  userRatingId: number;
  description: string;
  stars: number;
}
export interface Rating {
  id: number;
  description: string;
  userRatingId: number;
  stars: number;
  createdAt: string;
  updatedAt: string;
  bookId: number;
}
export interface CreateRating extends Omit<UpdateRating, "id"> {}
