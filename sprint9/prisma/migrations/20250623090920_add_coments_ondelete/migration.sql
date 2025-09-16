-- DropForeignKey
ALTER TABLE "ArticleComent" DROP CONSTRAINT "ArticleComent_articleId_fkey";

-- DropForeignKey
ALTER TABLE "ProductComent" DROP CONSTRAINT "ProductComent_productId_fkey";

-- AddForeignKey
ALTER TABLE "ProductComent" ADD CONSTRAINT "ProductComent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleComent" ADD CONSTRAINT "ArticleComent_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
