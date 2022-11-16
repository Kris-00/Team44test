-- CreateTable
CREATE TABLE `Customer` (
    `id` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `account_status` VARCHAR(191) NOT NULL DEFAULT 'unlocked',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_modified` DATETIME(3) NOT NULL,
    `user_role` VARCHAR(191) NOT NULL DEFAULT 'customer',

    UNIQUE INDEX `Customer_email_key`(`email`),
    UNIQUE INDEX `Customer_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Administrator` (
    `id` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `user_role` VARCHAR(191) NOT NULL DEFAULT 'admin',
    `account_status` VARCHAR(191) NOT NULL DEFAULT 'unlocked',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_modified` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Administrator_email_key`(`email`),
    UNIQUE INDEX `Administrator_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` VARCHAR(191) NOT NULL,
    `hashedToken` VARCHAR(191) NOT NULL,
    `customer_id` VARCHAR(191) NULL,
    `revoked` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `administratorId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellingProductForm` (
    `id` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `company_name` VARCHAR(191) NOT NULL,
    `company_uen` VARCHAR(191) NOT NULL,
    `company_phone` VARCHAR(191) NOT NULL,
    `company_email` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `last_modified` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Services` (
    `booked_serviceslots_id` VARCHAR(191) NOT NULL,
    `bartending_serviceslots_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`booked_serviceslots_id`, `bartending_serviceslots_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookedServiceslots` (
    `id` VARCHAR(191) NOT NULL,
    `booked_date` VARCHAR(191) NOT NULL,
    `booked_time` VARCHAR(191) NOT NULL,
    `booked_status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `last_modified` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BartendingServiceslots` (
    `id` VARCHAR(191) NOT NULL,
    `booked_date` VARCHAR(191) NOT NULL,
    `booked_time` VARCHAR(191) NOT NULL,
    `booked_status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `last_modified` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccessLogs` (
    `id` VARCHAR(191) NOT NULL,
    `operation_type` VARCHAR(191) NOT NULL,
    `ip_address` VARCHAR(191) NOT NULL,
    `operation_time` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_modified` DATETIME(3) NOT NULL,
    `customer_id` VARCHAR(191) NOT NULL,
    `admin_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL DEFAULT 999,
    `description` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `product_code` VARCHAR(191) NOT NULL,
    `last_modified` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_administratorId_fkey` FOREIGN KEY (`administratorId`) REFERENCES `Administrator`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Services` ADD CONSTRAINT `Services_bartending_serviceslots_id_fkey` FOREIGN KEY (`bartending_serviceslots_id`) REFERENCES `BartendingServiceslots`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Services` ADD CONSTRAINT `Services_booked_serviceslots_id_fkey` FOREIGN KEY (`booked_serviceslots_id`) REFERENCES `BookedServiceslots`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessLogs` ADD CONSTRAINT `AccessLogs_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `Administrator`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessLogs` ADD CONSTRAINT `AccessLogs_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
