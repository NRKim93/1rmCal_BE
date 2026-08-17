import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import {ErrorCode} from "../../exception/error-code.enum";
import * as process from "node:process";
import {CookieUtil} from "../../utils/cookie.util";
import {Response} from "express";
import {RedisService} from "../../service/redis/redis.service";

@Injectable()
export class JwtService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: NestJwtService,
        private readonly redis:RedisService,
    ) {}

    private cachedPrivateKey?: string;
    private cachedPublicKey?: string;

    private getPositiveNumber(name: string): number {
        const value = Number(this.configService.get<string>(name));

        if (!Number.isFinite(value) || value <= 0) {
            throw new Error(`${name} must be a positive number`);
        }

        return value;
    }

    private getCookieOptions(): {
        maxAge: number;
        domain?: string;
        secure: boolean;
    } {
        const domain = this.configService.get<string>('COOKIE_DOMAIN')?.trim();
        const secureValue = this.configService.get<string | boolean>('COOKIE_SECURE');

        return {
            maxAge: this.getPositiveNumber('COOKIE_EXPIRE_TIME'),
            domain: domain || undefined,
            secure: secureValue === true || String(secureValue).toLowerCase() === 'true',
        };
    }

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
        const exp = this.getPositiveNumber('JWT_EXPIRE_TIME');
        const token = await this.signToken(exp,userId,{typ:'access'});
        const cookie = this.getCookieOptions();

        CookieUtil.setCookie(
            res,
            'accessToken',
            token,
            cookie.maxAge,
            cookie.domain,
            cookie.secure,
        );

        return token;
    }

    //  RefreshToken 생성
    async generateRefreshToken(res:Response,userId:string): Promise<string> {
        const exp = this.getPositiveNumber('REFRESH_EXPIRE_TIME');
        const token = await this.signToken(exp,userId,{typ:'refresh'});
        const cookie = this.getCookieOptions();
        const pre = String(this.configService.get('REFRESH_TOKEN'));

        await this.redis.hset(pre, userId, token);
        CookieUtil.setCookie(
            res,
            pre,
            token,
            cookie.maxAge,
            cookie.domain,
            cookie.secure,
        );

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

        if (payload?.typ !== 'access') throw ErrorCode.NOT_ACCESS_TOKEN;

        return {
            payload : payload as any,
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

        return {
            payload,
        };
    }
}
