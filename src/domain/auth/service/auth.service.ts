import { Injectable } from '@nestjs/common';

import {Response} from "express";
import {JwtService} from "../../../common/security/jwt/jwt.service";
import {CookieUtil} from "../../../common/utils/cookie.util";

type VerifyAccessResult = {
    state: boolean;
    newAccessToken?: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly jwt : JwtService,
    ) {}

    //  AccessToken 체크
    async verifyAccess(res:Response, accessToken:string, refreshToken:string): Promise<VerifyAccessResult> {
        //  accessToken이랑 refreshToken이 둘 다 없다? >> 갱신 불가능
        if(!accessToken && !refreshToken) return { state: false };

        if(accessToken) {
            try {
                //  accessToken 유효성 체크
                await this.jwt.verifyAccessToken(accessToken);
                return {state: true};
            } catch {
                try {
                    //  refreshToken 체크 후 accessToken 갱신
                    const refresh= await this.jwt.verifyRefreshToken(refreshToken);

                    console.log(refresh);

                    const userId = String(refresh.payload.sub)

                    const now = Math.floor(Date.now() / 1000);
                    const exp = Number(refresh.payload.exp);
                    const iat = Number(refresh.payload.iat?? now);
                    const envTtl = Number(process.env["REFRESH_EXPIRE_TIME"] ?? process.env["JWT_EXPIRE_TIME"]);
                    const totalTtl = exp > iat && Number.isFinite(exp - iat) ? (exp - iat) : envTtl;
                    const leftTtl = Math.max(0,exp - now);
                    const rat = totalTtl > 0 ? (leftTtl / totalTtl) : 0;

                    if(rat <= 0.5) await this.jwt.generateRefreshToken(res,userId);

                    await this.jwt.generateAccessToken(res,userId);
                } catch {
                    //  refreshToken 만료 시 재로그인 요청
                    return {state: false};
                }
            }
        }

        return {state: true};
    }
}
