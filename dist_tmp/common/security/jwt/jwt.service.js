"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const error_code_enum_1 = require("../../exception/error-code.enum");
const process = __importStar(require("node:process"));
const cookie_util_1 = require("../../utils/cookie.util");
const redis_service_1 = require("../../service/redis/redis.service");
let JwtService = class JwtService {
    constructor(configService, jwtService, redis) {
        this.configService = configService;
        this.jwtService = jwtService;
        this.redis = redis;
    }
    getPrivateKey() {
        if (this.cachedPrivateKey)
            return this.cachedPrivateKey;
        const b64 = this.configService.get('JWT_PRIVATE_KEY');
        if (!b64)
            throw error_code_enum_1.ErrorCode.JWT_PRIVATE_KEY_FAILED;
        this.cachedPrivateKey = Buffer.from(b64, 'base64').toString('utf-8').trim();
        return this.cachedPrivateKey;
    }
    getPublicKey() {
        if (this.cachedPublicKey)
            return this.cachedPublicKey;
        const b64 = this.configService.get('JWT_PUBLIC_KEY');
        if (!b64)
            throw error_code_enum_1.ErrorCode.JWT_PUBLIC_KEY_FAILED;
        this.cachedPublicKey = Buffer.from(b64, 'base64').toString('utf-8').trim();
        return this.cachedPublicKey;
    }
    signToken(expiresIn, userId, extra) {
        const privateKey = this.getPrivateKey();
        return this.jwtService.sign({ sub: userId, ...extra }, {
            privateKey,
            algorithm: 'RS256',
            expiresIn,
            issuer: process.env["ISSUER"],
            audience: process.env["AUDIENCE"],
        });
    }
    async generateAccessToken(res, userId) {
        const exp = Number(process.env["JWT_EXPIRE_TIME"]);
        const token = await this.signToken(exp, userId, { typ: 'access' });
        const cookieExp = Number(process.env["COOKIE_EXPIRE_TIME"]);
        cookie_util_1.CookieUtil.setCookie(res, 'accessToken', token, cookieExp);
        return token;
    }
    async generateRefreshToken(res, userId) {
        const exp = Number(process.env["REFRESH_EXPIRE_TIME"]);
        const token = await this.signToken(exp, userId, { typ: 'refresh' });
        const cookieExp = Number(process.env["COOKIE_EXPIRE_TIME"]);
        const pre = String(process.env["REFRESH_TOKEN"]);
        await this.redis.hset(pre, userId, token);
        cookie_util_1.CookieUtil.setCookie(res, pre, token, cookieExp);
        return token;
    }
    async verifyAccessToken(accessToken) {
        const publicKey = this.getPublicKey();
        const payload = await this.jwtService.verifyAsync(accessToken, {
            algorithms: ['RS256'],
            publicKey,
            issuer: this.configService.get('ISSUER') ?? process.env["ISSUER"],
            audience: this.configService.get('AUDIENCE') ?? process.env["AUDIENCE"],
            clockTolerance: 5,
        });
        if (payload?.typ !== 'access')
            throw error_code_enum_1.ErrorCode.NOT_ACCESS_TOKEN;
        return {
            payload: payload,
        };
    }
    async verifyRefreshToken(refreshToken) {
        const publicKey = this.getPublicKey();
        const payload = await this.jwtService.verifyAsync(refreshToken, {
            algorithms: ['RS256'],
            publicKey,
            issuer: this.configService.get('ISSUER') ?? process.env["ISSUER"],
            audience: this.configService.get('AUDIENCE') ?? process.env["AUDIENCE"],
            clockTolerance: 5,
        });
        if (payload?.typ !== 'refresh')
            throw error_code_enum_1.ErrorCode.NOT_REFRESH_TOKEN;
        return {
            payload,
        };
    }
};
exports.JwtService = JwtService;
exports.JwtService = JwtService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService,
        redis_service_1.RedisService])
], JwtService);
//# sourceMappingURL=jwt.service.js.map