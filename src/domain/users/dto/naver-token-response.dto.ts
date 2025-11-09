import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {HttpStatusCode} from "axios";

export class NaverTokenResponseDto {
    seq?: number;

    @IsString()
    id?: string;

    @IsString()
    email: string;

    code : HttpStatusCode;
}