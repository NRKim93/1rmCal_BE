import {PrismaService} from "../../../common/service/PrismaService";
import {Injectable} from "@nestjs/common";

@Injectable()
export class TrainingRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 사용자 ID를 받아서 최신 운동 정보 조회
  async getLatestTrainingByUser(seq: number) {
    return this.prisma.training.findMany({
        include: {
            users: {
                select: {
                    seq:true,
                    id:true
                },
            },

            training_history:{
                select:{
                    name: true,
                    weight:true,
                    weight_unit:true,
                    reps:true,
                    sets:true,
                    rest:true
                }
            },
        },
        where: {
            seq:seq
        },
        orderBy : {
            training_date : 'desc'
        },
    });
  };

  // training id를 받아서 운동 기록 조회
  async getTrainingHistoryByTraining(trainingSeq: number) {
    return await this.prisma.training_history.findMany({
      where: { training_seq: trainingSeq },
      orderBy: { seq: 'asc' }
    });
  }

  // 사용자 id를 받아서 최신 운동과 히스토리 조회
  async getLatestTrainingWithHistory(userSeq: number) {
    const latestTraining = await this.prisma.training.findFirst({
      where: { user_seq: userSeq },
      orderBy: { training_date: 'desc' },
      include: {
        training_history: {
          orderBy: { seq: 'asc' }
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


  // 운동별 히스토리 그룹화
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

  // 운동 카테고리 조회
  async getTrainingCategory(trainingName: string) {
    return await this.prisma.training_category.findFirst({
      where: { training_name: trainingName }
    });
  }

  // 모든 운동 카테고리 조회
  async getAllTrainingCategories() {
    const result =  await this.prisma.training_category.findMany({
      where: {
        training_name: {
          in: ['BENCHPRESS', 'SQUAT', 'DEADLIFT']
        }
      }
    });

    return result.map(result => ({
        seq: result.seq,
        trainingName: result.training_name,
        trainingDisplayName: result.training_display_name
      })
    );
  }
}