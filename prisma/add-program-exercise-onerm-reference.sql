ALTER TABLE `training_program_exercise`
    ADD COLUMN `one_rm_reference_category_seq` INT NULL;

CREATE INDEX `training_program_exercise_one_rm_reference_category_seq_idx`
    ON `training_program_exercise` (`one_rm_reference_category_seq`);

ALTER TABLE `training_program_exercise`
    ADD CONSTRAINT `training_program_exercise_one_rm_reference_category_seq_fkey`
    FOREIGN KEY (`one_rm_reference_category_seq`)
    REFERENCES `training_category` (`seq`)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- 기존 프로그램의 가슴 보조 운동은 벤치프레스 1RM을 기준으로 보수적인 시작 중량을 추천한다.
UPDATE `training_program_exercise` AS exercise
JOIN `training_category` AS target_category
    ON target_category.`seq` = exercise.`training_category_seq`
JOIN `training_category` AS reference_category
    ON reference_category.`training_name` = 'BENCHPRESS'
SET
    exercise.`one_rm_reference_category_seq` = reference_category.`seq`,
    exercise.`target_weight_rate` = CASE target_category.`training_name`
        WHEN 'PECDECFLY' THEN 30.00
        WHEN 'DUMBBELLFLY' THEN 12.50
        WHEN 'INCLINEBENCHPRESS' THEN 70.00
        WHEN 'INCLINECHESTPRESS' THEN 50.00
        WHEN 'DECLINEBENCHPRESS' THEN 80.00
        ELSE exercise.`target_weight_rate`
    END
WHERE target_category.`training_name` IN (
    'PECDECFLY',
    'DUMBBELLFLY',
    'INCLINEBENCHPRESS',
    'INCLINECHESTPRESS',
    'DECLINEBENCHPRESS'
);
