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
exports.TrainingRepository = void 0;
const PrismaService_1 = require("../../../common/service/PrismaService");
const common_1 = require("@nestjs/common");
let TrainingRepository = class TrainingRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getLatestTrainingByUser(seq) {
        return this.prisma.training.findMany({
            include: {
                users: {
                    select: {
                        seq: true,
                        id: true
                    },
                },
                training_history: {
                    select: {
                        name: true,
                        weight: true,
                        weight_unit: true,
                        reps: true,
                        sets: true,
                        rest: true
                    }
                },
            },
            where: {
                seq: seq
            },
            orderBy: {
                training_date: 'desc'
            },
        });
    }
    ;
    async getTrainingHistoryByTraining(trainingSeq) {
        return await this.prisma.training_history.findMany({
            where: { training_seq: trainingSeq },
            orderBy: { seq: 'asc' }
        });
    }
    async getLatestTrainingWithHistory(userSeq) {
        const latestTraining = await this.prisma.training.findFirst({
            where: { user_seq: userSeq },
            orderBy: { training_date: 'desc' },
            include: {
                training_history: {
                    orderBy: { seq: 'asc' }
                }
            }
        });
        if (!latestTraining) {
            return null;
        }
        const exerciseGroups = this.groupHistoryByExercise(latestTraining.training_history);
        return {
            trainingDate: latestTraining.training_date,
            exercises: exerciseGroups
        };
    }
    groupHistoryByExercise(histories) {
        const groups = new Map();
        histories.forEach(history => {
            if (!groups.has(history.name)) {
                groups.set(history.name, {
                    name: history.name,
                    sets: []
                });
            }
            groups.get(history.name).sets.push({
                weight: Number(history.weight),
                weightUnit: history.weight_unit,
                reps: Number(history.reps),
                rest: history.rest
            });
        });
        return Array.from(groups.values());
    }
    async getTrainingCategory(trainingName) {
        return await this.prisma.training_category.findFirst({
            where: { training_name: trainingName }
        });
    }
    async getAllTrainingCategories() {
        const result = await this.prisma.training_category.findMany({
            where: {
                training_name: {
                    in: ['BENCHPRESS', 'SQUAT', 'DEADLIFT']
                }
            }
        });
        return result.map(result => ({
            seq: result.seq,
            trainingName: result.training_name,
            trainingDisplayName: result.training_display_name
        }));
    }
    async getAutoComplete() {
        const result = await this.prisma.training_category.findMany({
            select: {
                seq: true,
                training_name: true,
                training_display_name: true
            },
            orderBy: { training_display_name: "asc" }
        });
        return result.map(result => ({
            seq: result.seq,
            trainingName: result.training_name,
            trainingDisplayName: result.training_display_name
        }));
    }
    async createTraining(userSeq, trainingDate, exercises) {
        const createdTraining = await this.prisma.training.create({
            data: {
                user_seq: userSeq,
                training_date: trainingDate
            }
        });
    }
};
exports.TrainingRepository = TrainingRepository;
exports.TrainingRepository = TrainingRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PrismaService_1.PrismaService])
], TrainingRepository);
//# sourceMappingURL=training.repository.js.map