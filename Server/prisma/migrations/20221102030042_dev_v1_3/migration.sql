/*
  Warnings:

  - You are about to alter the column `operation_type` on the `AccessLogs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `ip_address` on the `AccessLogs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.
  - You are about to alter the column `operation_time` on the `AccessLogs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `booked_date` on the `BartendingServiceslots` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `booked_time` on the `BartendingServiceslots` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `booked_date` on the `BookedServiceslots` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `booked_time` on the `BookedServiceslots` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `booked_status` on the `BookedServiceslots` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `quantity` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedSmallInt`.
  - You are about to alter the column `name` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(40)`.
  - You are about to alter the column `name` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(15,2)`.
  - You are about to alter the column `stock` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedSmallInt`.
  - You are about to alter the column `product_code` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `full_name` on the `SellingProductForm` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `company_name` on the `SellingProductForm` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `company_uen` on the `SellingProductForm` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.
  - You are about to alter the column `company_phone` on the `SellingProductForm` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.
  - You are about to alter the column `company_email` on the `SellingProductForm` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `full_name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `phone` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- DropForeignKey
ALTER TABLE `AccessLogs` DROP FOREIGN KEY `AccessLogs_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Cart` DROP FOREIGN KEY `Cart_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `Cart` DROP FOREIGN KEY `Cart_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Services` DROP FOREIGN KEY `Services_bartending_serviceslots_id_fkey`;

-- DropForeignKey
ALTER TABLE `Services` DROP FOREIGN KEY `Services_booked_serviceslots_id_fkey`;

-- AlterTable
ALTER TABLE `AccessLogs` MODIFY `operation_type` VARCHAR(30) NOT NULL,
    MODIFY `ip_address` VARCHAR(15) NOT NULL,
    MODIFY `operation_time` VARCHAR(30) NOT NULL;

-- AlterTable
ALTER TABLE `BartendingServiceslots` MODIFY `booked_date` VARCHAR(30) NOT NULL,
    MODIFY `booked_time` VARCHAR(30) NOT NULL;

-- AlterTable
ALTER TABLE `BookedServiceslots` MODIFY `booked_date` VARCHAR(30) NOT NULL,
    MODIFY `booked_time` VARCHAR(30) NOT NULL,
    MODIFY `booked_status` VARCHAR(30) NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `Cart` MODIFY `quantity` SMALLINT UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `Category` MODIFY `name` VARCHAR(40) NOT NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `public_id` VARCHAR(300) NULL,
    MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `price` DECIMAL(15, 2) NOT NULL DEFAULT 99999999.99,
    MODIFY `description` VARCHAR(2000) NOT NULL,
    MODIFY `stock` SMALLINT UNSIGNED NOT NULL,
    MODIFY `image_url` VARCHAR(2000) NOT NULL,
    MODIFY `product_code` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `SellingProductForm` MODIFY `full_name` VARCHAR(100) NOT NULL,
    MODIFY `company_name` VARCHAR(100) NOT NULL,
    MODIFY `company_uen` VARCHAR(10) NOT NULL,
    MODIFY `company_phone` VARCHAR(15) NOT NULL,
    MODIFY `company_email` VARCHAR(30) NOT NULL,
    MODIFY `message` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `otp` VARCHAR(191) NULL,
    MODIFY `full_name` VARCHAR(100) NOT NULL,
    MODIFY `email` VARCHAR(30) NOT NULL,
    MODIFY `phone` VARCHAR(15) NOT NULL,
    MODIFY `password` VARCHAR(100) NOT NULL;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `quantity` SMALLINT UNSIGNED NOT NULL,
    `order_status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `order_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `total_price` DECIMAL(15, 2) NOT NULL DEFAULT 99999999.99,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_modified` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Services` ADD CONSTRAINT `Services_bartending_serviceslots_id_fkey` FOREIGN KEY (`bartending_serviceslots_id`) REFERENCES `BartendingServiceslots`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Services` ADD CONSTRAINT `Services_booked_serviceslots_id_fkey` FOREIGN KEY (`booked_serviceslots_id`) REFERENCES `BookedServiceslots`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessLogs` ADD CONSTRAINT `AccessLogs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
