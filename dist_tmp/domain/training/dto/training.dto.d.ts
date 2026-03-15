export declare class TrainingDto {
    id: number;
    trainingId: number;
    userId: number;
    name: string;
    weight: number;
    weightUnit: string;
    reps: number;
    sets: number;
    rest: string;
}
export declare class CreateTrainingItemDto {
    trainingId: number;
    userId: number;
    name: string;
    weight: number;
    weightUnit: string;
    reps: number;
    sets: number;
    rest: string;
}
export declare class CreateTrainingRequestDto {
    param: CreateTrainingItemDto[];
}
export declare function getLastTrainingHistory(lastName: string, lastSets: number, lastReps: number): Partial<TrainingDto>;
export declare function createTrainingItem(userSeq: number, trainingSeq: number, name: string, weight: number, weightUnit: string, reps: number, sets: number, rest: string): Partial<TrainingDto>;
