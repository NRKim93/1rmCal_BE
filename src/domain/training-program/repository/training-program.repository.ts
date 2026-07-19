import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../common/service/PrismaService';
import { CreateTrainingProgramRequestDto } from '../dto/create-training-program.dto';

@Injectable()
export class TrainingProgramRepository {
  constructor(private readonly prisma: PrismaService) {}

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
            request.days.flatMap((day) =>
              day.exercises.map((exercise) => exercise.trainingCategorySeq),
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
              create: request.days.map((day) => ({
                week_order: day.weekOrder,
                day_order: day.dayOrder,
                name: day.name,
                training_program_exercises: {
                  create: day.exercises.map((exercise) => ({
                    training_category_seq: exercise.trainingCategorySeq,
                    exercise_order: exercise.exerciseOrder,
                    target_sets: exercise.targetSets,
                    target_reps_min: exercise.targetRepsMin,
                    target_reps_max: exercise.targetRepsMax,
                    rest_seconds: exercise.restSeconds,
                    target_weight_rate: exercise.targetWeightRate,
                  })),
                },
              })),
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
