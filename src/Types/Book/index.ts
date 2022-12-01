export interface Book {
  id: number;
  bookName: string;
  authorName: string;
  pages: number;
  chapters: number;
  publishingCompanyName: string;
  linguage: string;
  quantity: number;
  imgUrl: string;
  price: number;
  sallerId: number;
}

export interface CreateBook {
  bookName: string;
  authorName: string;
  pages: number;
  imgUrl: string;
  price: number;
  chapters: number;
  publishingCompanyName: string;
  linguage: string;
  quantity: number;
}

export interface Rating {
  id: number;
  description: string;
  userRatingId: number;
  createdAt: string;
  updatedAt: string;
  bookId: number;
}
export interface UpdateBook {
  bookName: string;
  authorName: string;
  pages: number;
  imgUrl: string;
  ratings?: Array<Rating>;
  price: number;
  chapters: number;
  publishingCompanyName: string;
  linguage: string;
  quantity: number;
}
