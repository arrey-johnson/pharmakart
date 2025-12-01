"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmaciesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../../entities");
const pharmacies_service_1 = require("./pharmacies.service");
const pharmacies_controller_1 = require("./pharmacies.controller");
let PharmaciesModule = class PharmaciesModule {
};
exports.PharmaciesModule = PharmaciesModule;
exports.PharmaciesModule = PharmaciesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([entities_1.Pharmacy, entities_1.PharmacyMedicine, entities_1.Medicine, entities_1.Order, entities_1.Category])],
        controllers: [pharmacies_controller_1.PharmaciesController],
        providers: [pharmacies_service_1.PharmaciesService],
        exports: [pharmacies_service_1.PharmaciesService],
    })
], PharmaciesModule);
//# sourceMappingURL=pharmacies.module.js.map