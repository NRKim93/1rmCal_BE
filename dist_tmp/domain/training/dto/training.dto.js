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
exports.CreateTrainingRequestDto = exports.CreateTrainingItemDto = exports.TrainingDto = void 0;
exports.getLastTrainingHistory = getLastTrainingHistory;
exports.createTrainingItem = createTrainingItem;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class TrainingDto {
}
exports.TrainingDto = TrainingDto;
class CreateTrainingItemDto {
}
exports.CreateTrainingItemDto = CreateTrainingItemDto;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTrainingItemDto.prototype, "trainingId", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTrainingItemDto.prototype, "userId", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTrainingItemDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTrainingItemDto.prototype, "weight", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTrainingItemDto.prototype, "weightUnit", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTrainingItemDto.prototype, "reps", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTrainingItemDto.prototype, "sets", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTrainingItemDto.prototype, "rest", void 0);
class CreateTrainingRequestDto {
}
exports.CreateTrainingRequestDto = CreateTrainingRequestDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateTrainingItemDto),
    __metadata("design:type", Array)
], CreateTrainingRequestDto.prototype, "param", void 0);
function getLastTrainingHistory(lastName, lastSets, lastReps) {
    return {
        name: lastName,
        sets: lastSets,
        reps: lastReps
    };
}
function createTrainingItem(userSeq, trainingSeq, name, weight, weightUnit, reps, sets, rest) {
    return {
        userId: userSeq,
        trainingId: trainingSeq,
        name,
        weight,
        weightUnit,
        reps,
        sets,
        rest
    };
}
//# sourceMappingURL=training.dto.js.map