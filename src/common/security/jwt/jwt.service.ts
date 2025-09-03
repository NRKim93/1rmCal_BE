import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import {ErrorCode} from "../../exception/error-code.enum";
import * as process from "node:process";
import {CookieUtil} from "../../utils/cookie.util";
import {Response} from "express";

@Injectable()
export class JwtService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: NestJwtService,
    ) {}

    private cachedPrivateKey?: string;
    private cachedPublicKey?: string;

    //  개인키 발급
    private getPrivateKey(): string {
        //
        if (this.cachedPrivateKey) return this.cachedPrivateKey;

        const b64 = this.configService.get<string>('JWT_PRIVATE_KEY');
        if (!b64) throw ErrorCode.JWT_PRIVATE_KEY_FAILED;
        this.cachedPrivateKey = Buffer.from(b64, 'base64').toString('utf-8').trim();

        return this.cachedPrivateKey
    }

    //  공개키 발급
    private getPublicKey(): string {
        //
        if (this.cachedPublicKey) return this.cachedPublicKey;

        const b64 = this.configService.get<string>('JWT_PUBLIC_KEY');
        if (!b64) throw ErrorCode.JWT_PUBLIC_KEY_FAILED;
        this.cachedPublicKey = Buffer.from(b64, 'base64').toString('utf-8').trim();

        return this.cachedPublicKey;
    }

    private signToken(
        expiresIn:string | number,
        userId:string,
        extra?: Record<string, any>
    ) {
        const privateKey = this.getPrivateKey();

        return this.jwtService.sign(
            {sub: userId, ...extra},
            {
                privateKey,
                algorithm: 'RS256',
                expiresIn,
                issuer:process.env["ISSUER"],
                audience:process.env["AUDIENCE"],
            }
        );
    }

    //  AccessToken 생성
    async generateAccessToken(res:Response,userId:string): Promise<string> {
        const exp = Number(process.env["JWT_EXPIRE_TIME"]);
        const token = await this.signToken(exp,userId,{typ:'access'});
        const cookieExp = Number(process.env["COOKIE_EXPIRE_TIME"]);
        CookieUtil.setCookie(res, 'accessToken',token,cookieExp);

        return token;
    }

    //  RefreshToken 생성
    async generateRefreshToken(res:Response,userId:string): Promise<string> {
        const exp = Number(process.env["REFRESH_EXPIRE_TIME"]);
        const token = await this.signToken(exp,userId,{typ:'refresh'});
        const cookieExp = Number(process.env["COOKIE_EXPIRE_TIME"]);
        CookieUtil.setCookie(res,'refreshToken',token,cookieExp);

        return token;
    }

    //  AccessToken 인증
    async verifyAccessToken(accessToken: string): Promise<any> {
        const publicKey = this.getPublicKey();

        const payload = await this.jwtService.verifyAsync(accessToken, {
            algorithms: ['RS256'],
            publicKey,
            issuer: this.configService.get('ISSUER') ?? process.env["ISSUER"],
            audience: this.configService.get('AUDIENCE') ?? process.env["AUDIENCE"],
            clockTolerance:5,
        });

        //  시간 계산
        const now = Math.floor(Date.now() / 1000);

        const  rawExp = (payload as any)?.exp;
        const exp =
            typeof rawExp === 'number'
                ? rawExp
                : typeof rawExp === 'string'
                    ? parseInt(rawExp)
                    : undefined;
        const remainingSec = exp ? Math.max(exp - now, 0) : 0;

        console.log("now : " + now);
        console.log("exp : " + exp);


        return {
            payload : payload as any,
            remainingSec,
            expires: exp ? new Date(exp * 1000) : undefined,
        };
    }

    //  refreshToken 검증
    async verifyRefreshToken(refreshToken: string): Promise<any> {
        const publicKey = this.getPublicKey();

        const payload = await this.jwtService.verifyAsync(refreshToken, {
            algorithms: ['RS256'],
            publicKey,
            issuer: this.configService.get('ISSUER') ?? process.env["ISSUER"],
            audience: this.configService.get('AUDIENCE') ?? process.env["AUDIENCE"],
            clockTolerance:5,
        });

        if (payload?.typ !== 'refresh') throw ErrorCode.NOT_REFRESH_TOKEN;

        //  시간 계산
        const now = Math.floor(Date.now() / 1000);
        const exp = payload?.exp === 'number' ? payload.exp : 0;
        const remainingSec = Math.max(exp - now,0);

        return {
            payload,
            remainingSec,
            expires: exp ? new Date(exp * 1000) : undefined,
        };
    }
} 