import { Type } from "class-transformer";
import { training_mode } from "@prisma/client";
import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";

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
    @IsOptional()
    @IsInt()
    @Min(1)
    trainingCategorySeq?: number;

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

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(0)
    restSeconds?: number;
}

export class CreateTrainingRequestDto {
    @IsOptional()
    @IsEnum(training_mode)
    mode?: training_mode;

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    userProgramSeq?: number;

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    programDaySeq?: number;

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
