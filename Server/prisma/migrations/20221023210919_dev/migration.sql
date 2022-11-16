/*
  Warnings:

  - You are about to drop the column `admin_id` on the `AccessLogs` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `AccessLogs` table. All the data in the column will be lost.
  - You are about to drop the column `administratorId` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the `Administrator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `AccessLogs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `AccessLogs` DROP FOREIGN KEY `AccessLogs_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `AccessLogs` DROP FOREIGN KEY `AccessLogs_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `RefreshToken` DROP FOREIGN KEY `RefreshToken_administratorId_fkey`;

-- DropForeignKey
ALTER TABLE `RefreshToken` DROP FOREIGN KEY `RefreshToken_customer_id_fkey`;

-- AlterTable
ALTER TABLE `AccessLogs` DROP COLUMN `admin_id`,
    DROP COLUMN `customer_id`,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `RefreshToken` DROP COLUMN `administratorId`,
    DROP COLUMN `customer_id`,
    ADD COLUMN `user_id` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Administrator`;

-- DropTable
DROP TABLE `Customer`;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `account_status` VARCHAR(191) NOT NULL DEFAULT 'unlocked',
    `last_modified` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_role` VARCHAR(191) NOT NULL DEFAULT 'customer',

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cart` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_modified` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessLogs` ADD CONSTRAINT `AccessLogs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
