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
exports.WithdrawalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let WithdrawalsService = class WithdrawalsService {
    withdrawalsRepository;
    ordersRepository;
    constructor(withdrawalsRepository, ordersRepository) {
        this.withdrawalsRepository = withdrawalsRepository;
        this.ordersRepository = ordersRepository;
    }
    async getPharmacyEarnings(pharmacyId) {
        const deliveredOrders = await this.ordersRepository.find({
            where: {
                pharmacyId,
                status: entities_1.OrderStatus.DELIVERED,
            },
        });
        const totalEarnings = deliveredOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        const completedWithdrawals = await this.withdrawalsRepository.find({
            where: {
                pharmacyId,
                status: entities_1.WithdrawalStatus.COMPLETED,
            },
        });
        const totalWithdrawn = completedWithdrawals.reduce((sum, w) => sum + Number(w.amount), 0);
        const pendingWithdrawals = await this.withdrawalsRepository.find({
            where: [
                { pharmacyId, status: entities_1.WithdrawalStatus.PENDING },
                { pharmacyId, status: entities_1.WithdrawalStatus.PROCESSING },
            ],
        });
        const pendingAmount = pendingWithdrawals.reduce((sum, w) => sum + Number(w.amount), 0);
        const availableBalance = totalEarnings - totalWithdrawn - pendingAmount;
        return {
            totalEarnings,
            totalWithdrawn,
            pendingAmount,
            availableBalance,
            totalOrders: deliveredOrders.length,
        };
    }
    async requestWithdrawal(pharmacyId, amount, method, accountNumber, accountName, bankName) {
        const earnings = await this.getPharmacyEarnings(pharmacyId);
        if (amount <= 0) {
            throw new common_1.BadRequestException('Withdrawal amount must be greater than 0');
        }
        if (amount > earnings.availableBalance) {
            throw new common_1.BadRequestException(`Insufficient balance. Available: ${earnings.availableBalance} XAF`);
        }
        const minWithdrawal = 1000;
        if (amount < minWithdrawal) {
            throw new common_1.BadRequestException(`Minimum withdrawal amount is ${minWithdrawal} XAF`);
        }
        const withdrawal = this.withdrawalsRepository.create({
            pharmacyId,
            amount,
            method,
            accountNumber,
            accountName,
            bankName,
            status: entities_1.WithdrawalStatus.PENDING,
        });
        return this.withdrawalsRepository.save(withdrawal);
    }
    async getWithdrawals(pharmacyId) {
        return this.withdrawalsRepository.find({
            where: { pharmacyId },
            order: { createdAt: 'DESC' },
        });
    }
    async getWithdrawal(id) {
        return this.withdrawalsRepository.findOne({
            where: { id },
            relations: ['pharmacy'],
        });
    }
    async updateWithdrawalStatus(id, status, transactionReference, rejectionReason) {
        const withdrawal = await this.withdrawalsRepository.findOne({
            where: { id },
        });
        if (!withdrawal) {
            throw new common_1.BadRequestException('Withdrawal not found');
        }
        withdrawal.status = status;
        if (status === entities_1.WithdrawalStatus.COMPLETED) {
            withdrawal.processedAt = new Date();
            if (transactionReference) {
                withdrawal.transactionReference = transactionReference;
            }
        }
        if (status === entities_1.WithdrawalStatus.REJECTED && rejectionReason) {
            withdrawal.rejectionReason = rejectionReason;
        }
        return this.withdrawalsRepository.save(withdrawal);
    }
    async getAllPendingWithdrawals() {
        return this.withdrawalsRepository.find({
            where: [
                { status: entities_1.WithdrawalStatus.PENDING },
                { status: entities_1.WithdrawalStatus.PROCESSING },
            ],
            relations: ['pharmacy'],
            order: { createdAt: 'ASC' },
        });
    }
};
exports.WithdrawalsService = WithdrawalsService;
exports.WithdrawalsService = WithdrawalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Withdrawal)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], WithdrawalsService);
//# sourceMappingURL=withdrawals.service.js.map