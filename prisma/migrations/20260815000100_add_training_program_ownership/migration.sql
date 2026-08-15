ALTER TABLE `training_program`
  ADD COLUMN `owner_user_seq` INTEGER NULL,
  ADD COLUMN `is_public` BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN `source_program_seq` INTEGER NULL;

DROP INDEX `training_program_code_version_key` ON `training_program`;

CREATE UNIQUE INDEX `training_program_owner_user_seq_code_version_key`
  ON `training_program`(`owner_user_seq`, `code`, `version`);
CREATE INDEX `training_program_owner_user_seq_is_active_idx`
  ON `training_program`(`owner_user_seq`, `is_active`);
CREATE INDEX `training_program_is_public_is_active_idx`
  ON `training_program`(`is_public`, `is_active`);
CREATE INDEX `training_program_source_program_seq_idx`
  ON `training_program`(`source_program_seq`);

ALTER TABLE `training_program`
  ADD CONSTRAINT `training_program_owner_user_seq_fkey`
  FOREIGN KEY (`owner_user_seq`) REFERENCES `users`(`seq`)
  ON DELETE SET NULL ON UPDATE CASCADE;
