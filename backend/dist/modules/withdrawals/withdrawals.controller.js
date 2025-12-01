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
exports.WithdrawalsController = void 0;
const common_1 = require("@nestjs/common");
const withdrawals_service_1 = require("./withdrawals.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let WithdrawalsController = class WithdrawalsController {
    withdrawalsService;
    constructor(withdrawalsService) {
        this.withdrawalsService = withdrawalsService;
    }
    getEarnings(pharmacyId) {
        return this.withdrawalsService.getPharmacyEarnings(pharmacyId);
    }
    requestWithdrawal(body) {
        return this.withdrawalsService.requestWithdrawal(body.pharmacyId, body.amount, body.method, body.accountNumber, body.accountName, body.bankName);
    }
    getPharmacyWithdrawals(pharmacyId) {
        return this.withdrawalsService.getWithdrawals(pharmacyId);
    }
    getWithdrawal(id) {
        return this.withdrawalsService.getWithdrawal(id);
    }
    getPendingWithdrawals() {
        return this.withdrawalsService.getAllPendingWithdrawals();
    }
    updateStatus(id, body) {
        return this.withdrawalsService.updateWithdrawalStatus(id, body.status, body.transactionReference, body.rejectionReason);
    }
};
exports.WithdrawalsController = WithdrawalsController;
__decorate([
    (0, common_1.Get)('earnings/:pharmacyId'),
    __param(0, (0, common_1.Param)('pharmacyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WithdrawalsController.prototype, "getEarnings", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WithdrawalsController.prototype, "requestWithdrawal", null);
__decorate([
    (0, common_1.Get)('pharmacy/:pharmacyId'),
    __param(0, (0, common_1.Param)('pharmacyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WithdrawalsController.prototype, "getPharmacyWithdrawals", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WithdrawalsController.prototype, "getWithdrawal", null);
__decorate([
    (0, common_1.Get)('admin/pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WithdrawalsController.prototype, "getPendingWithdrawals", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WithdrawalsController.prototype, "updateStatus", null);
exports.WithdrawalsController = WithdrawalsController = __decorate([
    (0, common_1.Controller)('withdrawals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [withdrawals_service_1.WithdrawalsService])
], WithdrawalsController);
//# sourceMappingURL=withdrawals.controller.js.map