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
exports.Withdrawal = exports.WithdrawalMethod = exports.WithdrawalStatus = void 0;
const typeorm_1 = require("typeorm");
const pharmacy_entity_1 = require("./pharmacy.entity");
var WithdrawalStatus;
(function (WithdrawalStatus) {
    WithdrawalStatus["PENDING"] = "PENDING";
    WithdrawalStatus["PROCESSING"] = "PROCESSING";
    WithdrawalStatus["COMPLETED"] = "COMPLETED";
    WithdrawalStatus["REJECTED"] = "REJECTED";
})(WithdrawalStatus || (exports.WithdrawalStatus = WithdrawalStatus = {}));
var WithdrawalMethod;
(function (WithdrawalMethod) {
    WithdrawalMethod["MTN_MOMO"] = "MTN_MOMO";
    WithdrawalMethod["ORANGE_MONEY"] = "ORANGE_MONEY";
    WithdrawalMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
})(WithdrawalMethod || (exports.WithdrawalMethod = WithdrawalMethod = {}));
let Withdrawal = class Withdrawal {
    id;
    pharmacyId;
    pharmacy;
    amount;
    method;
    accountNumber;
    accountName;
    bankName;
    status;
    rejectionReason;
    transactionReference;
    processedAt;
    createdAt;
    updatedAt;
};
exports.Withdrawal = Withdrawal;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Withdrawal.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Withdrawal.prototype, "pharmacyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pharmacy_entity_1.Pharmacy),
    (0, typeorm_1.JoinColumn)({ name: 'pharmacyId' }),
    __metadata("design:type", pharmacy_entity_1.Pharmacy)
], Withdrawal.prototype, "pharmacy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Withdrawal.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WithdrawalMethod,
    }),
    __metadata("design:type", String)
], Withdrawal.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Withdrawal.prototype, "accountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Withdrawal.prototype, "accountName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Withdrawal.prototype, "bankName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WithdrawalStatus,
        default: WithdrawalStatus.PENDING,
    }),
    __metadata("design:type", String)
], Withdrawal.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Withdrawal.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Withdrawal.prototype, "transactionReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Withdrawal.prototype, "processedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Withdrawal.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Withdrawal.prototype, "updatedAt", void 0);
exports.Withdrawal = Withdrawal = __decorate([
    (0, typeorm_1.Entity)('withdrawals')
], Withdrawal);
//# sourceMappingURL=withdrawal.entity.js.map