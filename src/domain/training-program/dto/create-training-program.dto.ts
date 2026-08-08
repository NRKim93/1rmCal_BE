import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

function normalizeProgramCode(params: TransformFnParams): unknown {
  const value: unknown = params.value;
  return typeof value === 'string' ? value.trim().toUpperCase() : value;
}

export class CreateTrainingProgramExerciseDto {
  @ApiProperty({ description: '운동 종목 PK', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  trainingCategorySeq!: number;

  @ApiPropertyOptional({
    description: '목표 중량 계산에 사용할 기준 1RM 운동 종목 PK',
    example: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  oneRmReferenceCategorySeq?: number;

  @ApiProperty({ description: '회차 내 운동 순서', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  exerciseOrder!: number;

  @ApiProperty({ description: '목표 세트 수', example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  targetSets!: number;

  @ApiProperty({ description: '세트당 목표 반복 횟수 최솟값', example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  targetRepsMin!: number;

  @ApiProperty({ description: '세트당 목표 반복 횟수 최댓값', example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  targetRepsMax!: number;

  @ApiPropertyOptional({
    description: '세트 사이 목표 휴식 시간(초)',
    example: 180,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  restSeconds?: number;

  @ApiPropertyOptional({
    description: '1RM 대비 목표 중량 백분율',
    example: 75,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  targetWeightRate?: number;
}

export class CreateTrainingProgramDayDto {
  @ApiProperty({ description: '주차 내 1부터 시작하는 일차 순번', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  dayOrder!: number;

  @ApiProperty({ description: '회차 표시명', example: '1주차 A' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ type: [CreateTrainingProgramExerciseDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => CreateTrainingProgramExerciseDto)
  exercises!: CreateTrainingProgramExerciseDto[];
}

export class CreateTrainingProgramWeekDto {
  @ApiProperty({ description: '1부터 시작하는 주차 순번', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  weekOrder!: number;

  @ApiProperty({ type: [CreateTrainingProgramDayDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @ValidateNested({ each: true })
  @Type(() => CreateTrainingProgramDayDto)
  days!: CreateTrainingProgramDayDto[];
}

export class CreateTrainingProgramRequestDto {
  @ApiProperty({
    description: '프로그램 정규 코드',
    example: 'STRONG_LIFTS_5X5',
  })
  @Transform(normalizeProgramCode)
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[A-Z0-9_]+$/)
  code!: string;

  @ApiProperty({ description: '프로그램 표시명', example: '스트롱리프트 5x5' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ description: '프로그램 설명' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ description: '프로그램 버전', default: 1, example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  version = 1;

  @ApiPropertyOptional({
    description: '신규 사용자 선택 가능 여부',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive = true;

  @ApiProperty({ type: [CreateTrainingProgramWeekDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(52)
  @ValidateNested({ each: true })
  @Type(() => CreateTrainingProgramWeekDto)
  weeks!: CreateTrainingProgramWeekDto[];
}

export class CreateTrainingProgramVersionRequestDto extends OmitType(
  CreateTrainingProgramRequestDto,
  ['code', 'version'] as const,
) {}
