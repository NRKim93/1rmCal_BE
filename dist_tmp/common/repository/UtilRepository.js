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
exports.UtilRepository = void 0;
const error_code_enum_1 = require("../exception/error-code.enum");
const PrismaService_1 = require("../service/PrismaService");
const common_1 = require("@nestjs/common");
let UtilRepository = class UtilRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async idGenerate(key) {
        const idValue = await this.prisma.idtables.findFirst({
            select: {
                id_val: true
            },
            where: {
                id_key: key
            }
        });
        if (!idValue) {
            throw error_code_enum_1.ErrorCode.DATABASE_ERROR;
        }
        return idValue.id_val;
    }
    async setId(key) {
        await this.prisma.idtables.update({
            where: {
                id_key: key
            },
            data: {
                id_val: { increment: 1 }
            }
        });
    }
};
exports.UtilRepository = UtilRepository;
exports.UtilRepository = UtilRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PrismaService_1.PrismaService])
], UtilRepository);
//# sourceMappingURL=UtilRepository.js.map