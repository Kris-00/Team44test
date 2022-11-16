/*
  Warnings:

  - Made the column `predecessor` on table `RefreshToken` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `RefreshToken` MODIFY `predecessor` VARCHAR(191) NOT NULL;
