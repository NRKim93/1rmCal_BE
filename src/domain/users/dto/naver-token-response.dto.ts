import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {HttpStatusCode} from "axios";

export class NaverTokenResponseDto {
    @IsString()
    email: string;
    code : HttpStatusCode;
}