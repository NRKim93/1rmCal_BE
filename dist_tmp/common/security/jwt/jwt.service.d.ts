import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Response } from "express";
import { RedisService } from "../../service/redis/redis.service";
export declare class JwtService {
    private readonly configService;
    private readonly jwtService;
    private readonly redis;
    constructor(configService: ConfigService, jwtService: NestJwtService, redis: RedisService);
    private cachedPrivateKey?;
    private cachedPublicKey?;
    private getPrivateKey;
    private getPublicKey;
    private signToken;
    generateAccessToken(res: Response, userId: string): Promise<string>;
    generateRefreshToken(res: Response, userId: string): Promise<string>;
    verifyAccessToken(accessToken: string): Promise<any>;
    verifyRefreshToken(refreshToken: string): Promise<any>;
}
