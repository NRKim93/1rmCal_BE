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
exports.IdGenerate = void 0;
const common_1 = require("@nestjs/common");
const UtilRepository_1 = require("../repository/UtilRepository");
let IdGenerate = class IdGenerate {
    constructor(repository) {
        this.repository = repository;
    }
    async idGenerate(key) {
        const idValue = await this.repository.idGenerate(key);
        const newId = String(idValue).padStart(4, '0');
        const id = `THE_GYM_${newId}`;
        await this.repository.setId(key);
        return id;
    }
};
exports.IdGenerate = IdGenerate;
exports.IdGenerate = IdGenerate = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UtilRepository_1.UtilRepository])
], IdGenerate);
//# sourceMappingURL=id.generate.js.map