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
exports.TrainingController = void 0;
const common_1 = require("@nestjs/common");
const training_service_1 = require("../service/training.service");
const RsData_1 = require("../../../common/rsData/RsData");
const training_dto_1 = require("../dto/training.dto");
let TrainingController = class TrainingController {
    constructor(trainingService) {
        this.trainingService = trainingService;
    }
    async getLatestHistory(seq) {
        const lastHistory = await this.trainingService.getLatestHistory(seq);
        return await (0, RsData_1.success)(lastHistory);
    }
    async getAllTrainingCategories() {
        const trainingCategories = await this.trainingService.getAllTrainingCategories();
        return await (0, RsData_1.success)(trainingCategories);
    }
    async getAutoComplete() {
        const result = await this.trainingService.getAutoComplete();
        return await (0, RsData_1.success)(result);
    }
    async createTraining(body) {
        console.log(body.param);
        return 0;
    }
};
exports.TrainingController = TrainingController;
__decorate([
    (0, common_1.Get)('/getLatestHistory'),
    __param(0, (0, common_1.Query)('seq')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "getLatestHistory", null);
__decorate([
    (0, common_1.Get)('/getAllTrainingCategories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "getAllTrainingCategories", null);
__decorate([
    (0, common_1.Get)('/getAutoComplete'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "getAutoComplete", null);
__decorate([
    (0, common_1.Post)('/create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [training_dto_1.CreateTrainingRequestDto]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "createTraining", null);
exports.TrainingController = TrainingController = __decorate([
    (0, common_1.Controller)('/api/v1/training'),
    __metadata("design:paramtypes", [training_service_1.TrainingService])
], TrainingController);
//# sourceMappingURL=training.controller.js.map