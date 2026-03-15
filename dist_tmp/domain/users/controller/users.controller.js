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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const oauth_service_1 = require("../service/oauth.service");
const RsData_1 = require("../../../common/rsData/RsData");
const user_service_1 = require("../service/user.service");
const naver_token_request_dto_1 = require("../dto/naver-token-request.dto");
const user_join_request_dto_1 = require("../dto/user-join-request.dto");
const axios_1 = require("axios");
let UsersController = class UsersController {
    constructor(oauthService, userService) {
        this.oauthService = oauthService;
        this.userService = userService;
    }
    async createNaverUser(dto, res) {
        const naverUser = await this.oauthService.createNaverUser(dto, res);
        if (naverUser.code == axios_1.HttpStatusCode.Created)
            return await (0, RsData_1.created)(naverUser);
        return await (0, RsData_1.success)(naverUser);
    }
    async createNickname(dto) {
        const newNickName = await this.userService.createNickname(dto);
        return await (0, RsData_1.success)(newNickName);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('/naver/createNaverUser'),
    (0, swagger_1.ApiOperation)({ summary: '네이버 OAuth 로그인 콜백' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [naver_token_request_dto_1.NaverTokenRequestDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createNaverUser", null);
__decorate([
    (0, common_1.Post)('/setNickname'),
    (0, swagger_1.ApiOperation)({ summary: '닉네임 입력' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_join_request_dto_1.UserJoinRequestDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createNickname", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('/api/v1/users'),
    __metadata("design:paramtypes", [oauth_service_1.OauthService,
        user_service_1.UserService])
], UsersController);
//# sourceMappingURL=users.controller.js.map