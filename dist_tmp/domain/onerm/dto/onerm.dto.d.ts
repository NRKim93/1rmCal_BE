export declare class onermRequestDto {
    weight: number;
    reps: number;
}
export declare class onermResponseDto {
    repsTable: Array<{
        reps: number;
        weight: number;
    }>;
    oneRm: number;
}
export declare class OnermSaveDto {
    author: string;
    trainingName: string;
    weight: number;
    unit: string;
}
