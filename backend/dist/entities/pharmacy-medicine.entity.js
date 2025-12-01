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
exports.PharmacyMedicine = void 0;
const typeorm_1 = require("typeorm");
const pharmacy_entity_1 = require("./pharmacy.entity");
const medicine_entity_1 = require("./medicine.entity");
let PharmacyMedicine = class PharmacyMedicine {
    id;
    pharmacyId;
    pharmacy;
    medicineId;
    medicine;
    price;
    stockQuantity;
    isActive;
    createdAt;
    updatedAt;
};
exports.PharmacyMedicine = PharmacyMedicine;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PharmacyMedicine.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PharmacyMedicine.prototype, "pharmacyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pharmacy_entity_1.Pharmacy),
    (0, typeorm_1.JoinColumn)({ name: 'pharmacyId' }),
    __metadata("design:type", pharmacy_entity_1.Pharmacy)
], PharmacyMedicine.prototype, "pharmacy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PharmacyMedicine.prototype, "medicineId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => medicine_entity_1.Medicine),
    (0, typeorm_1.JoinColumn)({ name: 'medicineId' }),
    __metadata("design:type", medicine_entity_1.Medicine)
], PharmacyMedicine.prototype, "medicine", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], PharmacyMedicine.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PharmacyMedicine.prototype, "stockQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], PharmacyMedicine.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PharmacyMedicine.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PharmacyMedicine.prototype, "updatedAt", void 0);
exports.PharmacyMedicine = PharmacyMedicine = __decorate([
    (0, typeorm_1.Entity)('pharmacy_medicines'),
    (0, typeorm_1.Unique)(['pharmacyId', 'medicineId'])
], PharmacyMedicine);
//# sourceMappingURL=pharmacy-medicine.entity.js.map