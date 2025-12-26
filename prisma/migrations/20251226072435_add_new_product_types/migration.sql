/*
  Warnings:

  - The values [FABRIC] on the enum `ProductType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `color` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_number]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductType_new" AS ENUM ('SHAWL', 'STOLE', 'MUFFLER', 'RUMALA', 'DRESS', 'KIMONO', 'CAPE', 'KAFTAN', 'SCARF');
ALTER TABLE "Product" ALTER COLUMN "product_type" TYPE "ProductType_new" USING ("product_type"::text::"ProductType_new");
ALTER TYPE "ProductType" RENAME TO "ProductType_old";
ALTER TYPE "ProductType_new" RENAME TO "ProductType";
DROP TYPE "ProductType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_product_id_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "color",
DROP COLUMN "product_id",
DROP COLUMN "quantity",
DROP COLUMN "size",
ADD COLUMN     "admin_contact_email" TEXT,
ADD COLUMN     "admin_contact_phone" TEXT,
ADD COLUMN     "order_number" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "length" DOUBLE PRECISION,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "sub_category" TEXT,
ADD COLUMN     "wash_care" TEXT[],
ADD COLUMN     "width" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_order_number_key" ON "Order"("order_number");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
