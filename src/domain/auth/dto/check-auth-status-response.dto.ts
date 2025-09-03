import {IsBoolean, isBoolean} from "class-validator";

export class CheckAuthStatusResponseDto {
    @IsBoolean()
    isLoggedIn : boolean
}