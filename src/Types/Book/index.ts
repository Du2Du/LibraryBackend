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
