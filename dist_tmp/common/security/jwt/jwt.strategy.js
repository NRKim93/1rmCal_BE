"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtRefreshStrategy = exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
function accessCookieExtractor(req) {
    if (req && req.cookies) {
        return req.cookies['accessToken'] || null;
    }
    return null;
}
function refreshCookieExtractor(req) {
    if (req && req.cookies) {
        return req.cookies['refreshToken'] || null;
    }
    return null;
}
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor(configService) {
        const pub = configService.get('JWT_PUBLIC_KEY');
        if (!pub)
            throw new Error('JWT_PUBLIC_KEY_FAILED');
        const publicKey = Buffer.from(pub, 'base64').toString('utf-8');
        super({
            jwtFromRequest: accessCookieExtractor,
            ignoreExpiration: false,
            algorithms: ['RS256'],
            secretOrKey: publicKey,
        });
        this.configService = configService;
    }
    async validate(payload) {
        return payload;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtStrategy);
let JwtRefreshStrategy = class JwtRefreshStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-refresh') {
    constructor(configService) {
        const pub = configService.get('JWT_PUBLIC_KEY');
        if (!pub)
            throw new Error('JWT_PUBLIC_KEY_FAILED');
        const publicKey = Buffer.from(pub, 'base64').toString('utf-8');
        super({
            jwtFromRequest: refreshCookieExtractor,
            ignoreExpiration: false,
            algorithms: ['RS256'],
            secretOrKey: publicKey,
        });
        this.configService = configService;
    }
    async validate(payload) {
        return payload;
    }
};
exports.JwtRefreshStrategy = JwtRefreshStrategy;
exports.JwtRefreshStrategy = JwtRefreshStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtRefreshStrategy);
//# sourceMappingURL=jwt.strategy.js.map