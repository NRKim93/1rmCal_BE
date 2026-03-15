"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnermModule = void 0;
const common_1 = require("@nestjs/common");
const onerm_service_1 = require("./service/onerm.service");
const onerm_controller_1 = require("./controller/onerm.controller");
const onerm_repository_1 = require("./repository/onerm.repository");
const PrismaService_1 = require("src/common/service/PrismaService");
let OnermModule = class OnermModule {
};
exports.OnermModule = OnermModule;
exports.OnermModule = OnermModule = __decorate([
    (0, common_1.Module)({
        controllers: [onerm_controller_1.OnermController],
        providers: [onerm_service_1.OnermService, onerm_repository_1.OnermRepository, PrismaService_1.PrismaService],
        exports: [onerm_repository_1.OnermRepository, PrismaService_1.PrismaService]
    })
], OnermModule);
//# sourceMappingURL=onerm.module.js.map