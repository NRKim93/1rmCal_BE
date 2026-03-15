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

    return this.prisma.$transaction(async tx => {
      const createdTraining = await tx.training.create({
        data: {
          user_seq: userSeq
        }
      });

      await tx.training_history.createMany({
        data: param.param.map(item => ({
          training_seq: createdTraining.seq,
          user_seq: userSeq,
          name: item.name,
          weight: item.weight,
          weight_unit: item.weightUnit,
          reps: item.reps,
          sets: item.sets,
          rest: this.parseRestTime(item.rest)
        }))
      });

      return createdTraining;
    });
  }

  private parseRestTime(rest: string) {
    const match = rest.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);

    if (!match) {
      throw new BadRequestException("rest must be in HH:mm or HH:mm:ss format");
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    const seconds = Number(match[3] ?? "0");

    if (hours > 23 || minutes > 59 || seconds > 59) {
      throw new BadRequestException("rest contains an invalid time value");
    }

    return new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds));
  }
}
