/*
  Warnings:

  - Added the required column `level` to the `AccessLogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `AccessLogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AccessLogs` ADD COLUMN `level` VARCHAR(30) NOT NULL,
    ADD COLUMN `meta` VARCHAR(100) NULL,
    ADD COLUMN `timestamp` DATETIME NOT NULL;
