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
exports.PharmaciesController = void 0;
const common_1 = require("@nestjs/common");
const pharmacies_service_1 = require("./pharmacies.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PharmaciesController = class PharmaciesController {
    pharmaciesService;
    constructor(pharmaciesService) {
        this.pharmaciesService = pharmaciesService;
    }
    findAll(verified) {
        return this.pharmaciesService.findAll(verified !== 'false');
    }
    verifyPharmacy(id) {
        return this.pharmaciesService.update(id, { isVerified: true });
    }
    findOne(id) {
        return this.pharmaciesService.findOne(id);
    }
    getInventory(id) {
        return this.pharmaciesService.getInventory(id);
    }
    addMedicine(id, body) {
        return this.pharmaciesService.addMedicine(id, body.medicineId, body.price, body.stockQuantity);
    }
    createMedicineAndAdd(id, body) {
        return this.pharmaciesService.createMedicineAndAdd(id, body.medicine, body.price, body.stockQuantity);
    }
    update(id, body) {
        return this.pharmaciesService.update(id, body);
    }
    getStats(id) {
        return this.pharmaciesService.getStats(id);
    }
    getLowStock(id, threshold) {
        return this.pharmaciesService.getLowStock(id, threshold ? parseInt(threshold) : 10);
    }
    updateStock(itemId, body) {
        return this.pharmaciesService.updateStock(itemId, body.stockQuantity);
    }
    getInventoryItem(itemId) {
        return this.pharmaciesService.getInventoryItem(itemId);
    }
    updateInventoryItem(itemId, body) {
        return this.pharmaciesService.updateInventoryItem(itemId, body.medicine || {}, { price: body.price, stockQuantity: body.stockQuantity });
    }
};
exports.PharmaciesController = PharmaciesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('verified')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PharmaciesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)(':id/verify'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PharmaciesController.prototype, "verifyPharmacy", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PharmaciesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/inventory'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PharmaciesController.prototype, "getInventory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/inventory'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PharmaciesController.prototype, "addMedicine", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/inventory/create'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PharmaciesController.prototype, "createMedicineAndAdd", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PharmaciesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/stats'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PharmaciesController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/low-stock'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('threshold')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PharmaciesController.prototype, "getLowStock", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('inventory/:itemId/stock'),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PharmaciesController.prototype, "updateStock", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('inventory/:itemId'),
    __param(0, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PharmaciesController.prototype, "getInventoryItem", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('inventory/:itemId'),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PharmaciesController.prototype, "updateInventoryItem", null);
exports.PharmaciesController = PharmaciesController = __decorate([
    (0, common_1.Controller)('pharmacies'),
    __metadata("design:paramtypes", [pharmacies_service_1.PharmaciesService])
], PharmaciesController);
//# sourceMappingURL=pharmacies.controller.js.map