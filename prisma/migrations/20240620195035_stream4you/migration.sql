/*
  Warnings:

  - Added the required column `artist` to the `Audio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genre` to the `Audio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Audio" ADD COLUMN "artist" TEXT DEFAULT 'Unknown';
ALTER TABLE "Audio" ADD COLUMN "genre" TEXT DEFAULT 'Unknown';