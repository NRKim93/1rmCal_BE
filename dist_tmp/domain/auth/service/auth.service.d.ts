import { Response } from "express";
import { JwtService } from "../../../common/security/jwt/jwt.service";
type VerifyAccessResult = {
    state: boolean;
    newAccessToken?: string;
};
export declare class AuthService {
    private readonly jwt;
    constructor(jwt: JwtService);
    verifyAccess(res: Response, accessToken: string, refreshToken: string): Promise<VerifyAccessResult>;
}
export {};
