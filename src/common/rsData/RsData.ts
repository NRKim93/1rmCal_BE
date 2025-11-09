import {HttpStatusCode} from "axios";
import { NaverTokenResponseDto } from "src/domain/users/dto/naver-token-response.dto";

export class RsData {
    constructor(
        public data : any,
        public message: string
    ) {}
}

//  HTTP_STATUS_CODE : 200일 경우
export async function success(data? : any,response?) : Promise<RsData> {
    return new RsData(data, "OK");
}

export async function checked(code:HttpStatusCode,flg : boolean) : Promise<RsData> {
    if (flg) return new RsData(code, "OK");
    else return new RsData(code, "NG");
}

//  HTTP_STATUS_CODE : 201일 경우
export async function created(dto :NaverTokenResponseDto) : Promise<RsData> {
    const email : string = dto.email;
    return new RsData(dto.code, "OK");
}