import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../common/service/PrismaService';
import { CreateTrainingProgramRequestDto } from '../dto/create-training-program.dto';

@Injectable()
export class TrainingProgramRepository {
  constructor(private readonly prisma: PrismaService) {}

  async start(programSeq: number, userSeq: number) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.users.findUnique({
        where: { seq: userSeq },
        select: { seq: true },
      });
      if (!user) throw new NotFoundException(`user not found: ${userSeq}`);

      const program = await tx.training_program.findFirst({
        where: { seq: programSeq, is_active: true },
        include: {
          training_program_days: {
            orderBy: [{ week_order: 'asc' }, { day_order: 'asc' }],
            include: {
              training_program_exercises: {
                orderBy: { exercise_order: 'asc' },
                include: {
                  training_category: {
                    select: {
                      seq: true,
                      training_name: true,
                      training_display_name: true,
                    },
                  },
                  one_rm_reference_category: {
                    select: {
                      seq: true,
                      training_name: true,
                      training_display_name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!program) {
        throw new NotFoundException(
          `active training program not found: ${programSeq}`,
        );
      }

      let userProgram = await tx.user_training_program.findFirst({
        where: {
          user_seq: userSeq,
          program_seq: programSeq,
          status: 'ACTIVE',
        },
        orderBy: { started_at: 'desc' },
      });

      if (!userProgram) {
        const firstDay = program.training_program_days[0];
        if (!firstDay) {
          throw new BadRequestException(
            `training program has no sessions: ${programSeq}`,
          );
        }
        userProgram = await tx.user_training_program.create({
          data: {
            user_seq: userSeq,
            program_seq: programSeq,
            current_week: firstDay.week_order,
            current_day: firstDay.day_order,
          },
        });
      }

      const programDay = program.training_program_days.find(
        (day) =>
          day.week_order === userProgram.current_week &&
          day.day_order === userProgram.current_day,
      );
      if (!programDay) {
        throw new BadRequestException(
          `current program session not found: week ${userProgram.current_week}, day ${userProgram.current_day}`,
        );
      }

      const oneRmTrainingNames = programDay.training_program_exercises
        .map((exercise) =>
          exercise.one_rm_reference_category ??
          (['BENCHPRESS', 'SQUAT', 'DEADLIFT'].includes(
            exercise.training_category.training_name,
          )
            ? exercise.training_category
            : null),
        )
        .filter((category) => category !== null)
        .flatMap((category) => [
          category.training_name,
          category.training_display_name,
        ]);
      const oneRmRecords =
        oneRmTrainingNames.length === 0
          ? []
          : await tx.onerm.findMany({
              where: {
                author: String(userSeq),
                training_name: { in: oneRmTrainingNames },
                source_weight: { not: null },
                source_reps: { not: null },
              },
              orderBy: { createdAt: 'desc' },
            });

      return { userProgram, program, programDay, oneRmRecords };
    });
  }

  async findActive(userSeq?: number) {
    return this.prisma.training_program.findMany({
      where: { is_active: true },
      orderBy: [{ created_at: 'desc' }, { seq: 'desc' }],
      include: {
        user_programs: {
          where: { user_seq: userSeq ?? -1 },
          orderBy: { started_at: 'desc' },
          take: 1,
        },
        training_program_days: {
          orderBy: [{ week_order: 'asc' }, { day_order: 'asc' }],
          include: {
            training_program_exercises: {
              orderBy: { exercise_order: 'asc' },
              include: {
                training_category: {
                  select: {
                    seq: true,
                    training_name: true,
                    training_display_name: true,
                  },
                },
                one_rm_reference_category: {
                  select: {
                    seq: true,
                    training_name: true,
                    training_display_name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async create(request: CreateTrainingProgramRequestDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const existing = await tx.training_program.findUnique({
          where: {
            code_version: {
              code: request.code,
              version: request.version,
            },
          },
          select: { seq: true },
        });

        if (existing) {
          throw new ConflictException(
            `training program already exists: ${request.code} v${request.version}`,
          );
        }

        const categorySeqs = [
          ...new Set(
            request.weeks.flatMap((week) =>
              week.days.flatMap((day) =>
                day.exercises.flatMap((exercise) => [
                  exercise.trainingCategorySeq,
                  ...(exercise.oneRmReferenceCategorySeq
                    ? [exercise.oneRmReferenceCategorySeq]
                    : []),
                ]),
              ),
            ),
          ),
        ];
        const categories = await tx.training_category.findMany({
          where: { seq: { in: categorySeqs } },
          select: { seq: true },
        });
        const existingCategorySeqs = new Set(
          categories.map((category) => category.seq),
        );
        const missingCategorySeqs = categorySeqs.filter(
          (seq) => !existingCategorySeqs.has(seq),
        );

        if (missingCategorySeqs.length > 0) {
          throw new BadRequestException(
            `training categories not found: ${missingCategorySeqs.join(', ')}`,
          );
        }

        return tx.training_program.create({
          data: {
            code: request.code,
            name: request.name,
            description: request.description,
            version: request.version,
            is_active: request.isActive,
            training_program_days: {
              create: request.weeks.flatMap((week) =>
                week.days.map((day) => ({
                  week_order: week.weekOrder,
                  day_order: day.dayOrder,
                  name: day.name,
                  training_program_exercises: {
                    create: day.exercises.map((exercise) => ({
                      training_category_seq: exercise.trainingCategorySeq,
                      one_rm_reference_category_seq:
                        exercise.oneRmReferenceCategorySeq,
                      exercise_order: exercise.exerciseOrder,
                      target_sets: exercise.targetSets,
                      target_reps_min: exercise.targetRepsMin,
                      target_reps_max: exercise.targetRepsMax,
                      rest_seconds: exercise.restSeconds,
                      target_weight_rate: exercise.targetWeightRate,
                    })),
                  },
                })),
              ),
            },
          },
          include: {
            training_program_days: {
              orderBy: [{ week_order: 'asc' }, { day_order: 'asc' }],
              include: {
                training_program_exercises: {
                  orderBy: { exercise_order: 'asc' },
                  include: {
                    training_category: {
                      select: {
                        seq: true,
                        training_name: true,
                        training_display_name: true,
                      },
                    },
                    one_rm_reference_category: {
                      select: {
                        seq: true,
                        training_name: true,
                        training_display_name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `training program already exists: ${request.code} v${request.version}`,
        );
      }

      throw error;
    }
  }
}
