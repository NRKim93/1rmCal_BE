import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class onermRequestDto {
    @ApiProperty ({
        description : '중량'
    })
    @Type(() => Number)
    @IsNumber()
    weight : number

    @ApiProperty ({
        description : '횟수'
    })
    @Type(() => Number)
    @IsNumber()
    reps : number
}


export class onermResponseDto {
    @ApiProperty ({
        description : '계산된 중량 및 횟수 값'
    })
    @Type(() => Number)
    @IsNumber()
    repsTable : Array<{ reps: number; weight: number }>;

    @ApiProperty ({
        description : '실제 1RM 값'
    })
    @Type(() => Number)
    @IsNumber()
    oneRm : number
}