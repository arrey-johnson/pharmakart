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
exports.DeliveriesController = void 0;
const common_1 = require("@nestjs/common");
const deliveries_service_1 = require("./deliveries.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let DeliveriesController = class DeliveriesController {
    deliveriesService;
    constructor(deliveriesService) {
        this.deliveriesService = deliveriesService;
    }
    findAll(riderId) {
        return this.deliveriesService.findAll(riderId);
    }
    findPending() {
        return this.deliveriesService.findPending();
    }
    getEarnings(req) {
        return this.deliveriesService.getRiderEarnings(req.user.userId);
    }
    findOne(id) {
        return this.deliveriesService.findOne(id);
    }
    assignRider(id, body) {
        return this.deliveriesService.assignRider(id, body.riderId);
    }
    updateStatus(id, body) {
        return this.deliveriesService.updateStatus(id, body.status);
    }
    rateDelivery(id, body) {
        return this.deliveriesService.rateDelivery(id, body.rating);
    }
};
exports.DeliveriesController = DeliveriesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('riderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "findPending", null);
__decorate([
    (0, common_1.Get)('earnings'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "getEarnings", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/assign'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "assignRider", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)(':id/rate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "rateDelivery", null);
exports.DeliveriesController = DeliveriesController = __decorate([
    (0, common_1.Controller)('deliveries'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [deliveries_service_1.DeliveriesService])
], DeliveriesController);
//# sourceMappingURL=deliveries.controller.js.map