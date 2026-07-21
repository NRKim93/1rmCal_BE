ALTER TABLE `onerm`
    ADD COLUMN `source_weight` DECIMAL(5, 2) NULL,
    ADD COLUMN `source_reps` INT NULL;

CREATE INDEX `onerm_author_training_name_createdAt_idx`
    ON `onerm` (`author`, `training_name`, `createdAt`);
