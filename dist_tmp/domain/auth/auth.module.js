"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./controller/auth.controller.ts/auth.controller");
const auth_service_1 = require("./service/auth.service");
const jwt_service_1 = require("../../common/security/jwt/jwt.service");
const cookie_util_1 = require("../../common/utils/cookie.util");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({})
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_service_1.JwtService, cookie_util_1.CookieUtil, config_1.ConfigService],
        exports: [auth_service_1.AuthService, config_1.ConfigService, jwt_service_1.JwtService]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map