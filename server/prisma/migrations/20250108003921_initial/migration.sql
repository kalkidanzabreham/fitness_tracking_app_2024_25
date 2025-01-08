-- CreateTable
CREATE TABLE `FitnessActivities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `FitnessActivities_email_key`(`email`),
    UNIQUE INDEX `FitnessActivities_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `duration` INTEGER NOT NULL,
    `caloriesBurned` INTEGER NOT NULL,
    `weight` DOUBLE NOT NULL,
    `age` INTEGER NOT NULL,
    `height` DOUBLE NOT NULL,
    `bmi` DOUBLE NOT NULL,
    `bmiLabel` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `FitnessActivities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
