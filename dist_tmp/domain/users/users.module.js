"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_controller_1 = require("./controller/users.controller");
const oauth_service_1 = require("./service/oauth.service");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const user_service_1 = require("./service/user.service");
const PrismaService_1 = require("../../common/service/PrismaService");
const oauth_repository_1 = require("./repository/oauth.repository");
const OauthTokenService_1 = require("../../common/service/OauthTokenService");
const user_repository_1 = require("./repository/user.repository");
const UtilRepository_1 = require("../../common/repository/UtilRepository");
const id_generate_1 = require("../../common/utils/id.generate");
const cookie_util_1 = require("../../common/utils/cookie.util");
const jwt_service_1 = require("../../common/security/jwt/jwt.service");
const jwt_1 = require("@nestjs/jwt");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule, config_1.ConfigModule, jwt_1.JwtModule.register({})],
        controllers: [users_controller_1.UsersController],
        providers: [
            oauth_repository_1.OauthRepository,
            oauth_service_1.OauthService,
            user_repository_1.UserRepository,
            user_service_1.UserService,
            PrismaService_1.PrismaService,
            OauthTokenService_1.OauthTokenService,
            UtilRepository_1.UtilRepository,
            id_generate_1.IdGenerate,
            jwt_service_1.JwtService,
            cookie_util_1.CookieUtil
        ],
        exports: [
            PrismaService_1.PrismaService,
            oauth_repository_1.OauthRepository,
            user_repository_1.UserRepository,
            UtilRepository_1.UtilRepository,
            id_generate_1.IdGenerate,
            jwt_service_1.JwtService,
            cookie_util_1.CookieUtil
        ]
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map