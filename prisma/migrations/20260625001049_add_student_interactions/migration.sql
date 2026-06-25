-- CreateTable
CREATE TABLE `StudentInteraction` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `resourceId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `duration` INTEGER NULL,
    `metadata` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StudentInteraction_studentId_idx`(`studentId`),
    INDEX `StudentInteraction_resourceId_idx`(`resourceId`),
    INDEX `StudentInteraction_createdAt_idx`(`createdAt`),
    INDEX `StudentInteraction_action_idx`(`action`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudentInteraction` ADD CONSTRAINT `StudentInteraction_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentInteraction` ADD CONSTRAINT `StudentInteraction_resourceId_fkey` FOREIGN KEY (`resourceId`) REFERENCES `Resource`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
