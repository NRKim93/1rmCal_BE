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
exports.UserRepository = void 0;
const PrismaService_1 = require("../../../common/service/PrismaService");
const common_1 = require("@nestjs/common");
let UserRepository = class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createNewUser(id, naverUser, platform) {
        const newUser = await this.prisma.users.create({
            data: {
                id: id,
                nickname: "",
                email: naverUser.email
            }
        });
        await this.prisma.oauths.create({
            data: {
                platform: platform,
                identify: String(naverUser.id),
                users: {
                    connect: { seq: newUser.seq }
                }
            }
        });
        return newUser;
    }
    async checkNickname(nickName, email) {
        const exists = await this.prisma.users.findUnique({
            where: {
                nickname: nickName,
                email: email,
            },
        });
        if (exists)
            return true;
        return false;
    }
    async setNickName(nickName, email) {
        await this.prisma.users.update({
            data: {
                nickname: nickName,
            },
            where: {
                email: email
            }
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PrismaService_1.PrismaService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map