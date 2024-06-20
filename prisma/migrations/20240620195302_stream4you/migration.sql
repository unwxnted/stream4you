/*
  Warnings:

  - Made the column `artist` on table `Audio` required. This step will fail if there are existing NULL values in that column.
  - Made the column `genre` on table `Audio` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Audio" ALTER COLUMN "artist" SET NOT NULL,
ALTER COLUMN "artist" DROP DEFAULT,
ALTER COLUMN "genre" SET NOT NULL,
ALTER COLUMN "genre" DROP DEFAULT;
