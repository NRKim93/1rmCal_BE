import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTrainingProgramRequestDto } from '../dto/create-training-program.dto';
import { TrainingProgramRepository } from '../repository/training-program.repository';

type ProgramWithDetails = Awaited<
  ReturnType<TrainingProgramRepository['create']>
>;

@Injectable()
export class TrainingProgramService {
  constructor(private readonly repository: TrainingProgramRepository) {}

  async create(request: CreateTrainingProgramRequestDto) {
    this.validateProgramStructure(request);
    const program = await this.repository.create(request);
    return this.toResponse(program);
  }

  async findActive(userSeq?: number) {
    const programs = await this.repository.findActive(userSeq);
    return programs.map((program) =>
      this.toResponse(program, program.user_programs[0]),
    );
  }

  async start(programSeq: number, userSeq: number) {
    const { userProgram, program, programDay, oneRmRecords } =
      await this.repository.start(programSeq, userSeq);
    return {
      userProgramSeq: userProgram.seq,
      programSeq: program.seq,
      programName: program.name,
      status: userProgram.status,
      currentWeek: userProgram.current_week,
      currentDay: userProgram.current_day,
      programDaySeq: programDay.seq,
      dayName: programDay.name,
      exercises: programDay.training_program_exercises.map((exercise) => {
        const trainingName = exercise.training_category.training_name;
        const directOneRmSupported = ['BENCHPRESS', 'SQUAT', 'DEADLIFT'].includes(
          trainingName,
        );
        const oneRmReferenceCategory =
          exercise.one_rm_reference_category ??
          (directOneRmSupported ? exercise.training_category : null);
        const oneRmSupported = oneRmReferenceCategory !== null;
        const oneRmRecord = oneRmRecords.find(
          (record) =>
            record.training_name === oneRmReferenceCategory?.training_name ||
            record.training_name ===
              oneRmReferenceCategory?.training_display_name,
        );
        const targetWeightRate =
          exercise.target_weight_rate === null
            ? null
            : Number(exercise.target_weight_rate);
        const oneRmWeight = oneRmRecord ? Number(oneRmRecord.weight) : null;
        const unit = oneRmRecord?.unit.toUpperCase() ?? null;
        const roundingIncrement = unit === 'LBS' ? 5 : 2.5;
        const estimatedWeight =
          oneRmWeight !== null && targetWeightRate !== null
            ? Math.round(
                ((oneRmWeight * targetWeightRate) / 100) /
                  roundingIncrement,
              ) * roundingIncrement
            : null;
        const estimatedWeightNote =
          trainingName === 'DUMBBELLFLY' ? '한 손 기준' : null;

        return {
          trainingCategorySeq: exercise.training_category_seq,
          trainingName,
          trainingDisplayName:
            exercise.training_category.training_display_name,
          exerciseOrder: exercise.exercise_order,
          targetSets: exercise.target_sets,
          targetRepsMin: exercise.target_reps_min,
          targetRepsMax: exercise.target_reps_max,
          restSeconds: exercise.rest_seconds,
          targetWeightRate,
          oneRmSupported,
          oneRmReferenceCategorySeq: oneRmReferenceCategory?.seq ?? null,
          oneRmReferenceTrainingName:
            oneRmReferenceCategory?.training_name ?? null,
          oneRmReferenceTrainingDisplayName:
            oneRmReferenceCategory?.training_display_name ?? null,
          oneRmWeight,
          oneRmUnit: unit,
          estimatedWeight,
          estimatedWeightNote,
        };
      }),
    };
  }

  private toResponse(
    program: ProgramWithDetails,
    userProgress?: {
      seq: number;
      status: string;
      current_week: number;
      current_day: number;
      completed_sessions: number;
    },
  ) {
    const weekOrders = [
      ...new Set(program.training_program_days.map((day) => day.week_order)),
    ];

    const totalSessions = program.training_program_days.length;
    const completedSessions = Math.min(
      userProgress?.completed_sessions ?? 0,
      totalSessions,
    );
    const percentage =
      totalSessions === 0
        ? 0
        : userProgress?.status === 'COMPLETED'
          ? 100
          : Math.round((completedSessions / totalSessions) * 100);

    return {
      seq: program.seq,
      code: program.code,
      name: program.name,
      description: program.description,
      version: program.version,
      isActive: program.is_active,
      createdAt: program.created_at,
      updatedAt: program.updated_at,
      progress: {
        userProgramSeq: userProgress?.seq ?? null,
        status: userProgress?.status ?? 'NOT_STARTED',
        completedSessions,
        totalSessions,
        percentage,
        currentWeek: userProgress?.current_week ?? 1,
        currentDay: userProgress?.current_day ?? 1,
      },
      weeks: weekOrders.map((weekOrder) => ({
        weekOrder,
        days: program.training_program_days
          .filter((day) => day.week_order === weekOrder)
          .map((day) => ({
            seq: day.seq,
            dayOrder: day.day_order,
            name: day.name,
            exercises: day.training_program_exercises.map((exercise) => ({
              seq: exercise.seq,
              trainingCategorySeq: exercise.training_category_seq,
              trainingName: exercise.training_category.training_name,
              trainingDisplayName:
                exercise.training_category.training_display_name,
              exerciseOrder: exercise.exercise_order,
              targetSets: exercise.target_sets,
              targetRepsMin: exercise.target_reps_min,
              targetRepsMax: exercise.target_reps_max,
              restSeconds: exercise.rest_seconds,
              targetWeightRate:
                exercise.target_weight_rate === null
                  ? null
                  : Number(exercise.target_weight_rate),
              oneRmReferenceCategorySeq:
                exercise.one_rm_reference_category_seq,
              oneRmReferenceTrainingName:
                exercise.one_rm_reference_category?.training_name ?? null,
              oneRmReferenceTrainingDisplayName:
                exercise.one_rm_reference_category?.training_display_name ??
                null,
              estimatedWeightNote:
                exercise.training_category.training_name === 'DUMBBELLFLY'
                  ? '한 손 기준'
                  : null,
            })),
          })),
      })),
    };
  }

  private validateProgramStructure(request: CreateTrainingProgramRequestDto) {
    const weekOrders = new Set<number>();

    for (const week of request.weeks) {
      if (weekOrders.has(week.weekOrder)) {
        throw new BadRequestException(
          `duplicate program week: week ${week.weekOrder}`,
        );
      }
      weekOrders.add(week.weekOrder);

      const dayOrders = new Set<number>();

      for (const day of week.days) {
        if (dayOrders.has(day.dayOrder)) {
          throw new BadRequestException(
            `duplicate program day: week ${week.weekOrder}, day ${day.dayOrder}`,
          );
        }
        dayOrders.add(day.dayOrder);

        const exerciseOrders = new Set<number>();
        const categorySeqs = new Set<number>();

        for (const exercise of day.exercises) {
          if (exerciseOrders.has(exercise.exerciseOrder)) {
            throw new BadRequestException(
              `duplicate exercise order ${exercise.exerciseOrder} in week ${week.weekOrder}, day ${day.dayOrder}`,
            );
          }
          exerciseOrders.add(exercise.exerciseOrder);

          if (categorySeqs.has(exercise.trainingCategorySeq)) {
            throw new BadRequestException(
              `duplicate training category ${exercise.trainingCategorySeq} in week ${week.weekOrder}, day ${day.dayOrder}`,
            );
          }
          categorySeqs.add(exercise.trainingCategorySeq);

          if (exercise.targetRepsMin > exercise.targetRepsMax) {
            throw new BadRequestException(
              `targetRepsMin cannot exceed targetRepsMax in week ${week.weekOrder}, day ${day.dayOrder}, exercise ${exercise.exerciseOrder}`,
            );
          }
        }
      }
    }
  }
}
