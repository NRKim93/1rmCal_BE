interface TrainingDto {
    id: number;
    trainingId: number;
    userId: number;
    name: string;
    weight: number;
    weightUnit: String;
    reps: number;
    sets: number;
    rest: String;
}

export function getLastTrainingHistory(
    lastName: string,
    lastSets: number,
    lastReps: number
    ): Partial<TrainingDto> {
    return {
        name: lastName,
        sets: lastSets,
        reps: lastReps
    }
}