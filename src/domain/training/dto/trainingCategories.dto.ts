import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class TrainingCategories {
    @ApiProperty({
        description: '시퀀스'
    })
    @Type(() => Number)
    @IsNumber()
    seq: number;

    @ApiProperty({
        description: '종목명'
    })
    @Type(() =>String)
    @IsString()
    trainingName: string

    @ApiProperty({
        description: '표시명'
    })
    @Type(() =>String)
    @IsString()
    trainingDisplayName: string
}