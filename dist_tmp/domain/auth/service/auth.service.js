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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_service_1 = require("../../../common/security/jwt/jwt.service");
let AuthService = class AuthService {
    constructor(jwt) {
        this.jwt = jwt;
    }
    async verifyAccess(res, accessToken, refreshToken) {
        if (!accessToken && !refreshToken)
            return { state: false };
        if (accessToken) {
            try {
                await this.jwt.verifyAccessToken(accessToken);
                return { state: true };
            }
            catch {
                try {
                    const refresh = await this.jwt.verifyRefreshToken(refreshToken);
                    const userId = String(refresh.payload.sub);
                    const now = Math.floor(Date.now() / 1000);
                    const exp = Number(refresh.payload.exp);
                    const iat = Number(refresh.payload.iat ?? now);
                    const envTtl = Number(process.env["REFRESH_EXPIRE_TIME"] ?? process.env["JWT_EXPIRE_TIME"]);
                    const totalTtl = exp > iat && Number.isFinite(exp - iat) ? (exp - iat) : envTtl;
                    const leftTtl = Math.max(0, exp - now);
                    const rat = totalTtl > 0 ? (leftTtl / totalTtl) : 0;
                    if (rat <= 0.5)
                        await this.jwt.generateRefreshToken(res, userId);
                    await this.jwt.generateAccessToken(res, userId);
                }
                catch {
                    return { state: false };
                }
            }
        }
        return { state: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_service_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map