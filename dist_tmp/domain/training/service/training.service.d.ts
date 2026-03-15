import { TrainingRepository } from "../repository/training.repository";
import { TrainingCategories } from '../dto/trainingCategories.dto';
export declare class TrainingService {
    private readonly trainingRepo;
    constructor(trainingRepo: TrainingRepository);
    getLatestHistory(seq: number): Promise<({
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
    getAllTrainingCategories(): Promise<TrainingCategories[]>;
    getAutoComplete(): Promise<TrainingCategories[]>;
    createTraining(param: any): Promise<number>;
}
