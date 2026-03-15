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
exports.OnermSaveDto = exports.onermResponseDto = exports.onermRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class onermRequestDto {
}
exports.onermRequestDto = onermRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '중량'
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], onermRequestDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '횟수'
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], onermRequestDto.prototype, "reps", void 0);
class onermResponseDto {
}
exports.onermResponseDto = onermResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '계산된 중량 및 횟수 값'
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Array)
], onermResponseDto.prototype, "repsTable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '실제 1RM 값'
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], onermResponseDto.prototype, "oneRm", void 0);
class OnermSaveDto {
}
exports.OnermSaveDto = OnermSaveDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '측정자'
    }),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OnermSaveDto.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '측정 종목'
    }),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OnermSaveDto.prototype, "trainingName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '기록(중량)'
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OnermSaveDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '단위'
    }),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OnermSaveDto.prototype, "unit", void 0);
//# sourceMappingURL=onerm.dto.js.map