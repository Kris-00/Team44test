/*
  Warnings:

  - You are about to drop the column `ip_address` on the `AccessLogs` table. All the data in the column will be lost.
  - You are about to drop the column `operation_time` on the `AccessLogs` table. All the data in the column will be lost.
  - You are about to drop the column `operation_type` on the `AccessLogs` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `AccessLogs` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `BartendingServiceslots` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BookedServiceslots` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SellingProductForm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Services` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `message` to the `AccessLogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_name` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `AccessLogs` DROP FOREIGN KEY `AccessLogs_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Cart` DROP FOREIGN KEY `Cart_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Services` DROP FOREIGN KEY `Services_bartending_serviceslots_id_fkey`;

-- DropForeignKey
ALTER TABLE `Services` DROP FOREIGN KEY `Services_booked_serviceslots_id_fkey`;

-- AlterTable
ALTER TABLE `AccessLogs` DROP COLUMN `ip_address`,
    DROP COLUMN `operation_time`,
    DROP COLUMN `operation_type`,
    DROP COLUMN `user_id`,
    ADD COLUMN `message` VARCHAR(6000) NOT NULL;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `categoryId`,
    ADD COLUMN `category_name` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `BartendingServiceslots`;

-- DropTable
DROP TABLE `BookedServiceslots`;

-- DropTable
DROP TABLE `Order`;

-- DropTable
DROP TABLE `SellingProductForm`;

-- DropTable
DROP TABLE `Services`;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_category_name_fkey` FOREIGN KEY (`category_name`) REFERENCES `Category`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
