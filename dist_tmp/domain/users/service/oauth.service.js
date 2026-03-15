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
exports.OauthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const oauth_repository_1 = require("../repository/oauth.repository");
const OauthTokenService_1 = require("src/common/service/OauthTokenService");
const user_repository_1 = require("../repository/user.repository");
const id_generate_1 = require("../../../common/utils/id.generate");
const jwt_service_1 = require("../../../common/security/jwt/jwt.service");
let OauthService = class OauthService {
    constructor(configService, oauthTokenService, oauthRepository, userRepository, idUtil, jwtService) {
        this.configService = configService;
        this.oauthTokenService = oauthTokenService;
        this.oauthRepository = oauthRepository;
        this.userRepository = userRepository;
        this.idUtil = idUtil;
        this.jwtService = jwtService;
    }
    async createNaverUser(dto, res) {
        const naverClientId = this.configService.get('NAVER_CLIENT_ID');
        const naverClientSecret = this.configService.get('NAVER_CLIENT_SECRET');
        const naverTokenUrl = this.configService.get('NAVER_TOKEN_URI');
        const naverProfileUrl = this.configService.get('NAVER_PROFILE_URI');
        const { code, state } = dto;
        const tokenResponse = await this.oauthTokenService.getOauthToken({
            oauthTokenUrl: naverTokenUrl,
            oauthClientId: naverClientId,
            oauthClientSecret: naverClientSecret,
            code: code,
            state: state
        });
        const accessToken = tokenResponse.access_token;
        const profileResponse = await this.oauthTokenService.getUserInfo(naverProfileUrl, accessToken);
        const naverUser = profileResponse.data.response;
        const nowUser = await this.oauthRepository.findNaverUser(naverUser.email);
        if (!nowUser && dto.mode === "signup") {
            const id = await this.idUtil.idGenerate("users");
            const newUser = await this.userRepository.createNewUser(id, naverUser, "NAVER");
            return { email: newUser.email, isLoggedIn: false, code: axios_1.HttpStatusCode.Created };
        }
        if (!nowUser && dto.mode === "login") {
            return { email: naverUser.email, isLoggedIn: false, code: axios_1.HttpStatusCode.Created };
        }
        const cookieExpire = this.configService.get('COOKIE_EXPIRE_TIME');
        const domain = this.configService.get('COOKIE_DOMAIN');
        await this.jwtService.generateAccessToken(res, nowUser.identify);
        await this.jwtService.generateRefreshToken(res, nowUser.identify);
        return { email: nowUser.users.email, seq: nowUser.users.seq, isLoggedIn: true, code: axios_1.HttpStatusCode.Ok };
    }
};
exports.OauthService = OauthService;
exports.OauthService = OauthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        OauthTokenService_1.OauthTokenService,
        oauth_repository_1.OauthRepository,
        user_repository_1.UserRepository,
        id_generate_1.IdGenerate,
        jwt_service_1.JwtService])
], OauthService);
//# sourceMappingURL=oauth.service.js.map