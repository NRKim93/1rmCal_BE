import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../common/service/PrismaService";
import {CreateTrainingRequestDto} from "../dto/training.dto";

@Injectable()
export class TrainingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getLatestTrainingByUser(seq: number) {
    return this.prisma.training.findMany({
      include: {
        users: {
          select: {
            seq: true,
            id: true
          }
        },
        training_history: {
          select: {
            name: true,
            weight: true,
            weight_unit: true,
            reps: true,
            sets: true,
            rest: true
          }
        }
      },
      where: {
        user_seq: seq
      },
      orderBy: {
        training_date: "desc"
      }
    });
  }

  async getLatestExerciseHistoryByUser(userSeq: number) {
    const histories = await this.prisma.training_history.findMany({
      where: {user_seq: userSeq},
      orderBy: [
        {training: {training_date: "desc"}},
        {training_seq: "desc"},
        {set_order: "asc"},
        {seq: "asc"},
      ],
      select: {
        training_seq: true,
        training_category_seq: true,
        name: true,
        weight: true,
        weight_unit: true,
        reps: true,
        set_order: true,
        training: {
          select: {training_date: true},
        },
      },
    });

    const latestByExercise = new Map<
      string,
      {
        trainingSeq: number;
        trainingCategorySeq: number | null;
        name: string;
        trainingDate: Date;
        sets: Array<{
          setOrder: number | null;
          weight: number;
          weightUnit: string;
          reps: number;
        }>;
      }
    >();

    histories.forEach(history => {
      const key = history.training_category_seq
        ? `category:${history.training_category_seq}`
        : `name:${history.name.trim().toLowerCase()}`;
      const existing = latestByExercise.get(key);

      if (existing && existing.trainingSeq !== history.training_seq) return;

      const set = {
        setOrder: history.set_order,
        weight: Number(history.weight),
        weightUnit: history.weight_unit,
        reps: Number(history.reps),
      };

      if (existing) {
        existing.sets.push(set);
        return;
      }

      latestByExercise.set(key, {
        trainingSeq: history.training_seq,
        trainingCategorySeq: history.training_category_seq,
        name: history.name,
        trainingDate: history.training.training_date,
        sets: [set],
      });
    });

    return Array.from(latestByExercise.values());
  }

  async getTrainingHistoryByTraining(trainingSeq: number) {
    return await this.prisma.training_history.findMany({
      where: {training_seq: trainingSeq},
      orderBy: {seq: "asc"}
    });
  }

  async getLatestTrainingWithHistory(userSeq: number) {
    const latestTraining = await this.prisma.training.findFirst({
      where: {user_seq: userSeq},
      orderBy: {training_date: "desc"},
      include: {
        training_history: {
          orderBy: {seq: "asc"}
        }
      }
    });

    if (!latestTraining) {
      return null;
    }

    const exerciseGroups = this.groupHistoryByExercise(latestTraining.training_history);

    return {
      trainingDate: latestTraining.training_date,
      exercises: exerciseGroups
    };
  }

  private groupHistoryByExercise(histories: any[]) {
    const groups = new Map();

    histories.forEach(history => {
      if (!groups.has(history.name)) {
        groups.set(history.name, {
          name: history.name,
          sets: []
        });
      }

      groups.get(history.name).sets.push({
        weight: Number(history.weight),
        weightUnit: history.weight_unit,
        reps: Number(history.reps),
        rest: history.rest
      });
    });

    return Array.from(groups.values());
  }

  async getTrainingCategory(trainingName: string) {
    return await this.prisma.training_category.findFirst({
      where: {training_name: trainingName}
    });
  }

  async getAllTrainingCategories() {
    const result = await this.prisma.training_category.findMany({
      where: {
        training_name: {
          in: ["BENCHPRESS", "SQUAT", "DEADLIFT"]
        }
      }
    });

    return result.map(result => ({
      seq: result.seq,
      trainingName: result.training_name,
      trainingDisplayName: result.training_display_name
    }));
  }

  async getAutoComplete() {
    const result = await this.prisma.training_category.findMany({
      select: {
        seq: true,
        training_name: true,
        training_display_name: true
      },
      orderBy: {training_display_name: "asc"}
    });

    return result.map(result => ({
      seq: result.seq,
      trainingName: result.training_name,
      trainingDisplayName: result.training_display_name
    }));
  }

  async createTraining(param: CreateTrainingRequestDto) {
    if (!param.param.length) {
      throw new BadRequestException("training param is empty");
    }

    const userSeq = param.param[0].userSeq;
    const hasDifferentUserSeq = param.param.some(item => item.userSeq !== userSeq);

    if (hasDifferentUserSeq) {
      throw new BadRequestException("all training items must have the same userSeq");
    }

    const mode = param.mode ?? "FREE";
    if (
      mode === "PROGRAM" &&
      (!param.userProgramSeq || !param.programDaySeq)
    ) {
      throw new BadRequestException(
        "program training requires userProgramSeq and programDaySeq",
      );
    }

    return this.prisma.$transaction(async tx => {
      let programContext: {
        userProgramSeq: number;
        programSeq: number;
        programDaySeq: number;
      } | null = null;

      if (mode === "PROGRAM") {
        const userProgram = await tx.user_training_program.findFirst({
          where: {
            seq: param.userProgramSeq,
            user_seq: userSeq,
            status: "ACTIVE",
          },
        });
        if (!userProgram) {
          throw new BadRequestException("active user training program not found");
        }

        const programDay = await tx.training_program_day.findFirst({
          where: {
            seq: param.programDaySeq,
            program_seq: userProgram.program_seq,
          },
          include: {
            training_program_exercises: {
              select: { training_category_seq: true },
            },
          },
        });
        if (
          !programDay ||
          programDay.week_order !== userProgram.current_week ||
          programDay.day_order !== userProgram.current_day
        ) {
          throw new BadRequestException("program day is not the current session");
        }

        const allowedCategorySeqs = new Set(
          programDay.training_program_exercises.map(
            exercise => exercise.training_category_seq,
          ),
        );
        const invalidItem = param.param.find(
          item =>
            !item.trainingCategorySeq ||
            !allowedCategorySeqs.has(item.trainingCategorySeq),
        );
        if (invalidItem) {
          throw new BadRequestException(
            "program training contains an invalid training category",
          );
        }

        programContext = {
          userProgramSeq: userProgram.seq,
          programSeq: userProgram.program_seq,
          programDaySeq: programDay.seq,
        };
      }

      const createdTraining = await tx.training.create({
        data: {
          user_seq: userSeq,
          mode,
          user_program_seq: programContext?.userProgramSeq,
          program_day_seq: programContext?.programDaySeq,
        }
      });

      await tx.training_history.createMany({
        data: param.param.map(item => ({
          training_seq: createdTraining.seq,
          user_seq: userSeq,
          training_category_seq: item.trainingCategorySeq,
          name: item.name,
          weight: item.weight,
          weight_unit: item.weightUnit,
          reps: item.reps,
          sets: item.sets,
          rest: this.parseRestTime(item.rest),
          set_order: item.sets,
          rest_seconds: item.restSeconds ?? this.parseRestSeconds(item.rest),
        }))
      });

      if (programContext) {
        const programDays = await tx.training_program_day.findMany({
          where: { program_seq: programContext.programSeq },
          orderBy: [{ week_order: "asc" }, { day_order: "asc" }],
          select: { seq: true, week_order: true, day_order: true },
        });
        const currentIndex = programDays.findIndex(
          day => day.seq === programContext.programDaySeq,
        );
        const nextDay = programDays[currentIndex + 1];

        await tx.user_training_program.update({
          where: { seq: programContext.userProgramSeq },
          data: nextDay
            ? {
                current_week: nextDay.week_order,
                current_day: nextDay.day_order,
                completed_sessions: { increment: 1 },
              }
            : {
                status: "COMPLETED",
                completed_at: new Date(),
                completed_sessions: { increment: 1 },
              },
        });
      }

      return createdTraining;
    });
  }

  private parseRestTime(rest: string) {
    const match = rest.match(/^(?:(\d{2}):)?(\d{2}):(\d{2})$/);

    if (!match) {
      throw new BadRequestException("rest must be in mm:ss or HH:mm:ss format");
    }

    const hours = Number(match[1] ?? "0");
    const minutes = Number(match[2]);
    const seconds = Number(match[3]);

    if (hours > 23 || minutes > 59 || seconds > 59) {
      throw new BadRequestException("rest contains an invalid time value");
    }

    return new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds));
  }

  private parseRestSeconds(rest: string) {
    const parsed = this.parseRestTime(rest);
    return (
      parsed.getUTCHours() * 3600 +
      parsed.getUTCMinutes() * 60 +
      parsed.getUTCSeconds()
    );
  }
}
