import { HttpStatusCode } from "axios";
export declare class NaverTokenResponseDto {
    seq?: number;
    id?: string;
    email: string;
    isLoggedIn: boolean;
    code: HttpStatusCode;
}
