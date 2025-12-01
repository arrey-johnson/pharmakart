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
exports.Delivery = exports.DeliveryStatus = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
const rider_entity_1 = require("./rider.entity");
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["PENDING"] = "PENDING";
    DeliveryStatus["ON_THE_WAY_TO_PHARMACY"] = "ON_THE_WAY_TO_PHARMACY";
    DeliveryStatus["PICKED_UP"] = "PICKED_UP";
    DeliveryStatus["ON_THE_WAY_TO_CLIENT"] = "ON_THE_WAY_TO_CLIENT";
    DeliveryStatus["DELIVERED"] = "DELIVERED";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
let Delivery = class Delivery {
    id;
    orderId;
    order;
    riderId;
    rider;
    status;
    pickupTime;
    deliveredTime;
    riderFee;
    riderRating;
    clientNotes;
    createdAt;
    updatedAt;
};
exports.Delivery = Delivery;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Delivery.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Delivery.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => order_entity_1.Order),
    (0, typeorm_1.JoinColumn)({ name: 'orderId' }),
    __metadata("design:type", order_entity_1.Order)
], Delivery.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Delivery.prototype, "riderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => rider_entity_1.Rider),
    (0, typeorm_1.JoinColumn)({ name: 'riderId' }),
    __metadata("design:type", rider_entity_1.Rider)
], Delivery.prototype, "rider", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DeliveryStatus,
        default: DeliveryStatus.PENDING,
    }),
    __metadata("design:type", String)
], Delivery.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Delivery.prototype, "pickupTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Delivery.prototype, "deliveredTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 500 }),
    __metadata("design:type", Number)
], Delivery.prototype, "riderFee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Delivery.prototype, "riderRating", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Delivery.prototype, "clientNotes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Delivery.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Delivery.prototype, "updatedAt", void 0);
exports.Delivery = Delivery = __decorate([
    (0, typeorm_1.Entity)('deliveries')
], Delivery);
//# sourceMappingURL=delivery.entity.js.map