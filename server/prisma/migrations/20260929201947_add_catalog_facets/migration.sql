/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `petId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productTypeId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropIndex
DROP INDEX "Product_categoryId_idx";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "categoryId",
ADD COLUMN     "petId" TEXT NOT NULL,
ADD COLUMN     "productTypeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ProductType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Facet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacetOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "facetId" TEXT NOT NULL,

    CONSTRAINT "FacetOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTypeFacet" (
    "productTypeId" TEXT NOT NULL,
    "facetId" TEXT NOT NULL,

    CONSTRAINT "ProductTypeFacet_pkey" PRIMARY KEY ("productTypeId","facetId")
);

-- CreateTable
CREATE TABLE "ProductFacetOption" (
    "productId" TEXT NOT NULL,
    "facetOptionId" TEXT NOT NULL,

    CONSTRAINT "ProductFacetOption_pkey" PRIMARY KEY ("productId","facetOptionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pet_slug_key" ON "Pet"("slug");

-- CreateIndex
CREATE INDEX "ProductType_categoryId_idx" ON "ProductType"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductType_categoryId_slug_key" ON "ProductType"("categoryId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Facet_slug_key" ON "Facet"("slug");

-- CreateIndex
CREATE INDEX "FacetOption_facetId_idx" ON "FacetOption"("facetId");

-- CreateIndex
CREATE UNIQUE INDEX "FacetOption_facetId_slug_key" ON "FacetOption"("facetId", "slug");

-- CreateIndex
CREATE INDEX "ProductFacetOption_facetOptionId_idx" ON "ProductFacetOption"("facetOptionId");

-- CreateIndex
CREATE INDEX "Product_petId_idx" ON "Product"("petId");

-- CreateIndex
CREATE INDEX "Product_productTypeId_idx" ON "Product"("productTypeId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "ProductType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductType" ADD CONSTRAINT "ProductType_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacetOption" ADD CONSTRAINT "FacetOption_facetId_fkey" FOREIGN KEY ("facetId") REFERENCES "Facet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTypeFacet" ADD CONSTRAINT "ProductTypeFacet_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "ProductType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTypeFacet" ADD CONSTRAINT "ProductTypeFacet_facetId_fkey" FOREIGN KEY ("facetId") REFERENCES "Facet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFacetOption" ADD CONSTRAINT "ProductFacetOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFacetOption" ADD CONSTRAINT "ProductFacetOption_facetOptionId_fkey" FOREIGN KEY ("facetOptionId") REFERENCES "FacetOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
