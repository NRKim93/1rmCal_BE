import { PrismaService } from "../../../common/service/PrismaService";
export declare class TrainingRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getLatestTrainingByUser(seq: number): Promise<({
        users: {
            seq: number;
            id: string;
        };
        training_history: {
            weight: import("@prisma/client/runtime/library").Decimal;
            reps: import("@prisma/client/runtime/library").Decimal;
            name: string;
            weight_unit: string;
            sets: import("@prisma/client/runtime/library").Decimal;
            rest: Date;
        }[];
    } & {
        seq: number;
        user_seq: number;
        training_date: Date;
    })[]>;
    getTrainingHistoryByTraining(trainingSeq: number): Promise<{
        weight: import("@prisma/client/runtime/library").Decimal;
        reps: import("@prisma/client/runtime/library").Decimal;
        seq: number;
        name: string;
        user_seq: number;
        training_seq: number;
        weight_unit: string;
        sets: import("@prisma/client/runtime/library").Decimal;
        rest: Date;
    }[]>;
    getLatestTrainingWithHistory(userSeq: number): Promise<{
        trainingDate: Date;
        exercises: any[];
    } | null>;
    private groupHistoryByExercise;
    getTrainingCategory(trainingName: string): Promise<{
        seq: number;
        training_name: string;
        training_display_name: string;
        training_type: string;
        target_category: string;
        target_muscle: string;
    } | null>;
    getAllTrainingCategories(): Promise<{
        seq: number;
        trainingName: string;
        trainingDisplayName: string;
    }[]>;
    getAutoComplete(): Promise<{
        seq: number;
        trainingName: string;
        trainingDisplayName: string;
    }[]>;
    createTraining(userSeq: number, trainingDate: Date, exercises: any[]): Promise<void>;
}
