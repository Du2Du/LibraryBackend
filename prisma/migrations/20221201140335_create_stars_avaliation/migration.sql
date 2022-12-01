/*
  Warnings:

  - Added the required column `starsAverage` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stars` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "starsAverage" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "stars" DOUBLE PRECISION NOT NULL;
