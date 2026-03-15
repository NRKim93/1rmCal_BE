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
exports.OnermController = void 0;
const common_1 = require("@nestjs/common");
const onerm_service_1 = require("../service/onerm.service");
const public_decorator_1 = require("src/common/security/public.decorator");
const swagger_1 = require("@nestjs/swagger");
const onerm_dto_1 = require("../dto/onerm.dto");
const RsData_1 = require("src/common/rsData/RsData");
let OnermController = class OnermController {
    constructor(service) {
        this.service = service;
    }
    async calculate(request) {
        const calResult = this.service.calculating(request);
        return (0, RsData_1.success)(calResult);
    }
    async saveOnerm(request) {
        const saveResult = this.service.save(request);
        return (0, RsData_1.success)(saveResult);
    }
};
exports.OnermController = OnermController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('/cal'),
    (0, swagger_1.ApiOperation)({ summary: '1rm 측정용 컨트롤러' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [onerm_dto_1.onermRequestDto]),
    __metadata("design:returntype", Promise)
], OnermController.prototype, "calculate", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '1rm 기록 저장용 컨트롤러 ' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [onerm_dto_1.OnermSaveDto]),
    __metadata("design:returntype", Promise)
], OnermController.prototype, "saveOnerm", null);
exports.OnermController = OnermController = __decorate([
    (0, common_1.Controller)('/api/v1/onerm'),
    __metadata("design:paramtypes", [onerm_service_1.OnermService])
], OnermController);
//# sourceMappingURL=onerm.controller.js.map