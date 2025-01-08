/*
  Warnings:

  - You are about to drop the column `age` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `bmi` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `bmiLabel` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `caloriesBurned` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `fitnessactivities` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `Users_userId_fkey`;

-- DropIndex
DROP INDEX `Users_userId_fkey` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `age`,
    DROP COLUMN `bmi`,
    DROP COLUMN `bmiLabel`,
    DROP COLUMN `caloriesBurned`,
    DROP COLUMN `date`,
    DROP COLUMN `duration`,
    DROP COLUMN `height`,
    DROP COLUMN `type`,
    DROP COLUMN `userId`,
    DROP COLUMN `weight`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'USER',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `fitnessactivities`;

-- CreateTable
CREATE TABLE `fitness_activities` (
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

-- CreateIndex
CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `users_username_key` ON `users`(`username`);

-- AddForeignKey
ALTER TABLE `fitness_activities` ADD CONSTRAINT `fitness_activities_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
