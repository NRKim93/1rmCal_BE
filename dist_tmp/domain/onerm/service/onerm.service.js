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
exports.OnermService = void 0;
const common_1 = require("@nestjs/common");
const onerm_repository_1 = require("../repository/onerm.repository");
let OnermService = class OnermService {
    constructor(onermRepository) {
        this.onermRepository = onermRepository;
    }
    calculating(request) {
        let oneRm;
        if (request.reps === 1) {
            oneRm = request.weight;
        }
        else {
            oneRm = Math.round(request.weight * (1 + request.reps / 30));
        }
        const repsTable = [];
        for (let r = 1; r <= 20; r++) {
            let estimatedWeight;
            if (r === 1) {
                estimatedWeight = oneRm;
            }
            else {
                estimatedWeight = Math.round((oneRm / (1 + r / 30)) * 10) / 10;
            }
            repsTable.push({ reps: r, weight: estimatedWeight });
        }
        const inputWeightIndex = repsTable.findIndex(item => item.reps === request.reps);
        if (inputWeightIndex !== -1) {
            repsTable[inputWeightIndex].weight = request.weight;
        }
        return {
            oneRm: oneRm,
            repsTable: repsTable
        };
    }
    async save(request) {
        return this.onermRepository.save(request);
    }
};
exports.OnermService = OnermService;
exports.OnermService = OnermService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [onerm_repository_1.OnermRepository])
], OnermService);
//# sourceMappingURL=onerm.service.js.map