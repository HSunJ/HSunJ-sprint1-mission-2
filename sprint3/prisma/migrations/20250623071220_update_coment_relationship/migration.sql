/*
  Warnings:

  - You are about to drop the `Coment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Coment" DROP CONSTRAINT "Coment_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Coment" DROP CONSTRAINT "Coment_productId_fkey";

-- DropTable
DROP TABLE "Coment";

-- CreateTable
CREATE TABLE "ProductComent" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT,

    CONSTRAINT "ProductComent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleComent" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "articleId" TEXT,

    CONSTRAINT "ArticleComent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductComent" ADD CONSTRAINT "ProductComent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleComent" ADD CONSTRAINT "ArticleComent_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;
