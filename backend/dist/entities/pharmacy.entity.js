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
exports.Pharmacy = exports.Subdivision = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var Subdivision;
(function (Subdivision) {
    Subdivision["DOUALA_I"] = "DOUALA_I";
    Subdivision["DOUALA_II"] = "DOUALA_II";
    Subdivision["DOUALA_III"] = "DOUALA_III";
    Subdivision["DOUALA_IV"] = "DOUALA_IV";
    Subdivision["DOUALA_V"] = "DOUALA_V";
})(Subdivision || (exports.Subdivision = Subdivision = {}));
let Pharmacy = class Pharmacy {
    id;
    userId;
    user;
    name;
    logoUrl;
    address;
    subdivision;
    latitude;
    longitude;
    openingHours;
    isVerified;
    rating;
    totalReviews;
    createdAt;
    updatedAt;
};
exports.Pharmacy = Pharmacy;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Pharmacy.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pharmacy.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Pharmacy.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pharmacy.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Pharmacy.prototype, "logoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pharmacy.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Subdivision,
    }),
    __metadata("design:type", String)
], Pharmacy.prototype, "subdivision", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Pharmacy.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Pharmacy.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Pharmacy.prototype, "openingHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Pharmacy.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 2, scale: 1, default: 0 }),
    __metadata("design:type", Number)
], Pharmacy.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Pharmacy.prototype, "totalReviews", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Pharmacy.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Pharmacy.prototype, "updatedAt", void 0);
exports.Pharmacy = Pharmacy = __decorate([
    (0, typeorm_1.Entity)('pharmacies')
], Pharmacy);
//# sourceMappingURL=pharmacy.entity.js.map