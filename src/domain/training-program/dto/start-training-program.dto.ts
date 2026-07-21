import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class StartTrainingProgramRequestDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userSeq!: number;
}
