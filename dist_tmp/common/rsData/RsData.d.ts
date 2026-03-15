import { HttpStatusCode } from "axios";
import { NaverTokenResponseDto } from "src/domain/users/dto/naver-token-response.dto";
export declare class RsData {
    data: any;
    message: string;
    constructor(data: any, message: string);
}
export declare function success(data?: any, response?: any): Promise<RsData>;
export declare function checked(code: HttpStatusCode, flg: boolean): Promise<RsData>;
export declare function created(dto: NaverTokenResponseDto): Promise<RsData>;
