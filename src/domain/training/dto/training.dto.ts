import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class TrainingDto {
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

export class CreateTrainingItemDto {
    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    trainingSeq?: number;

    @Type(() => Number)
    @IsNumber()
    userSeq: number;

    @Type(() => String)
    @IsString()
    name: string;

    @Type(() => Number)
    @IsNumber()
    weight: number;

    @Type(() => String)
    @IsString()
    weightUnit: string;

    @Type(() => Number)
    @IsNumber()
    reps: number;

    @Type(() => Number)
    @IsNumber()
    sets: number;

    @Type(() => String)
    @IsString()
    rest: string;
}

export class CreateTrainingRequestDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTrainingItemDto)
    param: CreateTrainingItemDto[];
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
    };
}

export function createTrainingItem(
    userSeq: number,
    trainingSeq: number,
    name: string,
    weight: number,
    weightUnit: string,
    reps: number,
    sets: number,
    rest: string
): Partial<TrainingDto> {
    return {
        userId: userSeq,
        trainingId: trainingSeq,
        name,
        weight,
        weightUnit,
        reps,
        sets,
        rest
    };
}
