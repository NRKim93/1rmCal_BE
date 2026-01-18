import { IsBoolean, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {HttpStatusCode} from "axios";

export class NaverTokenResponseDto {
    @ApiProperty({
        description: '시퀀스 번호'
    })
    seq?: number;

    @ApiProperty({
        description: 'id' 
    })
    @IsString()
    id?: string;

    @ApiProperty({
        description: '이메일 주소' 
    })    
    @IsString()
    email: string;

    @ApiProperty({
        description: '로그인 상태'
    })
    @IsBoolean()
    isLoggedIn: boolean; 

    code : HttpStatusCode;
}