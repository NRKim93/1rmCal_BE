import {HttpStatusCode} from "axios";
import {ErrorCode, ErrorCodeType, ErrorResponse} from "../exception/error-code.enum";
import { NaverTokenResponseDto } from "src/domain/users/dto/naver-token-response.dto";

export class RsData {
    constructor(
        public statusCode: number,
        public message: string,
        public data? : any
    ) {}
}

//  HTTP_STATUS_CODE : 200일 경우
export async function success(code : HttpStatusCode) : Promise<RsData> {
    return new RsData(code, "OK");
}

//  HTTP_STATUS_CODE : 201일 경우
export async function created(dto :NaverTokenResponseDto) : Promise<RsData> {
    const email : string = dto.email;
    return new RsData(dto.code, "OK", email);
}