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
exports.NaverTokenResponseDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class NaverTokenResponseDto {
}
exports.NaverTokenResponseDto = NaverTokenResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '시퀀스 번호'
    }),
    __metadata("design:type", Number)
], NaverTokenResponseDto.prototype, "seq", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'id'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NaverTokenResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '이메일 주소'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NaverTokenResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '로그인 상태'
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NaverTokenResponseDto.prototype, "isLoggedIn", void 0);
//# sourceMappingURL=naver-token-response.dto.js.map