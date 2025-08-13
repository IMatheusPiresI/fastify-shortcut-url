/*
  Warnings:

  - You are about to drop the column `original` on the `Url` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `Url` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Url_original_key";

-- AlterTable
ALTER TABLE "public"."Url" DROP COLUMN "original",
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Url_url_key" ON "public"."Url"("url");
