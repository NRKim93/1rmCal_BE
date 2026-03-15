"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const onerm_module_1 = require("./domain/onerm/onerm.module");
const config_1 = require("@nestjs/config");
const users_module_1 = require("./domain/users/users.module");
const auth_module_1 = require("./domain/auth/auth.module");
const redis_module_1 = require("./common/infra/redis/redis.module");
const redis_service_1 = require("./common/service/redis/redis.service");
const training_controller_1 = require("./domain/training/controller/training.controller");
const training_service_1 = require("./domain/training/service/training.service");
const training_module_1 = require("./domain/training/training.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            onerm_module_1.OnermModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            redis_module_1.RedisModule,
            training_module_1.TrainingModule
        ],
        providers: [redis_service_1.RedisService, training_service_1.TrainingService],
        controllers: [training_controller_1.TrainingController, training_controller_1.TrainingController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map