import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTrainingProgramRequestDto } from '../dto/create-training-program.dto';
import { TrainingProgramRepository } from '../repository/training-program.repository';

@Injectable()
export class TrainingProgramService {
  constructor(private readonly repository: TrainingProgramRepository) {}

  async create(request: CreateTrainingProgramRequestDto) {
    this.validateProgramStructure(request);
    const program = await this.repository.create(request);

    return {
      seq: program.seq,
      code: program.code,
      name: program.name,
      description: program.description,
      version: program.version,
      isActive: program.is_active,
      createdAt: program.created_at,
      updatedAt: program.updated_at,
      days: program.training_program_days.map((day) => ({
        seq: day.seq,
        weekOrder: day.week_order,
        dayOrder: day.day_order,
        name: day.name,
        exercises: day.training_program_exercises.map((exercise) => ({
          seq: exercise.seq,
          trainingCategorySeq: exercise.training_category_seq,
          trainingName: exercise.training_category.training_name,
          trainingDisplayName: exercise.training_category.training_display_name,
          exerciseOrder: exercise.exercise_order,
          targetSets: exercise.target_sets,
          targetRepsMin: exercise.target_reps_min,
          targetRepsMax: exercise.target_reps_max,
          restSeconds: exercise.rest_seconds,
          targetWeightRate:
            exercise.target_weight_rate === null
              ? null
              : Number(exercise.target_weight_rate),
        })),
      })),
    };
  }

  private validateProgramStructure(request: CreateTrainingProgramRequestDto) {
    const dayKeys = new Set<string>();

    for (const day of request.days) {
      const dayKey = `${day.weekOrder}:${day.dayOrder}`;
      if (dayKeys.has(dayKey)) {
        throw new BadRequestException(
          `duplicate program day: week ${day.weekOrder}, day ${day.dayOrder}`,
        );
      }
      dayKeys.add(dayKey);

      const exerciseOrders = new Set<number>();
      const categorySeqs = new Set<number>();

      for (const exercise of day.exercises) {
        if (exerciseOrders.has(exercise.exerciseOrder)) {
          throw new BadRequestException(
            `duplicate exercise order ${exercise.exerciseOrder} in week ${day.weekOrder}, day ${day.dayOrder}`,
          );
        }
        exerciseOrders.add(exercise.exerciseOrder);

        if (categorySeqs.has(exercise.trainingCategorySeq)) {
          throw new BadRequestException(
            `duplicate training category ${exercise.trainingCategorySeq} in week ${day.weekOrder}, day ${day.dayOrder}`,
          );
        }
        categorySeqs.add(exercise.trainingCategorySeq);

        if (exercise.targetRepsMin > exercise.targetRepsMax) {
          throw new BadRequestException(
            `targetRepsMin cannot exceed targetRepsMax in week ${day.weekOrder}, day ${day.dayOrder}, exercise ${exercise.exerciseOrder}`,
          );
        }
      }
    }
  }
}
