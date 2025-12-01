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
exports.DeliveriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let DeliveriesService = class DeliveriesService {
    deliveriesRepository;
    ordersRepository;
    constructor(deliveriesRepository, ordersRepository) {
        this.deliveriesRepository = deliveriesRepository;
        this.ordersRepository = ordersRepository;
    }
    async findAll(riderId) {
        const where = riderId ? { riderId } : {};
        return this.deliveriesRepository.find({
            where,
            relations: ['order', 'order.pharmacy', 'order.client', 'rider'],
            order: { createdAt: 'DESC' },
        });
    }
    async findPending() {
        return this.deliveriesRepository.find({
            where: { status: entities_1.DeliveryStatus.PENDING, riderId: null },
            relations: ['order', 'order.pharmacy', 'order.client'],
        });
    }
    async findOne(id) {
        return this.deliveriesRepository.findOne({
            where: { id },
            relations: ['order', 'order.pharmacy', 'order.client', 'rider'],
        });
    }
    async assignRider(deliveryId, riderId) {
        await this.deliveriesRepository.update(deliveryId, {
            riderId,
            status: entities_1.DeliveryStatus.ON_THE_WAY_TO_PHARMACY,
        });
        const delivery = await this.findOne(deliveryId);
        if (delivery) {
            await this.ordersRepository.update(delivery.orderId, {
                status: entities_1.OrderStatus.ASSIGNED_TO_RIDER,
            });
        }
        return this.findOne(deliveryId);
    }
    async updateStatus(id, status) {
        const updateData = { status };
        if (status === entities_1.DeliveryStatus.PICKED_UP) {
            updateData.pickupTime = new Date();
        }
        else if (status === entities_1.DeliveryStatus.DELIVERED) {
            updateData.deliveredTime = new Date();
        }
        await this.deliveriesRepository.update(id, updateData);
        const delivery = await this.findOne(id);
        if (delivery) {
            let orderStatus;
            switch (status) {
                case entities_1.DeliveryStatus.ON_THE_WAY_TO_CLIENT:
                    orderStatus = entities_1.OrderStatus.OUT_FOR_DELIVERY;
                    break;
                case entities_1.DeliveryStatus.DELIVERED:
                    orderStatus = entities_1.OrderStatus.DELIVERED;
                    break;
            }
            if (orderStatus) {
                await this.ordersRepository.update(delivery.orderId, { status: orderStatus });
            }
        }
        return this.findOne(id);
    }
    async rateDelivery(id, rating) {
        await this.deliveriesRepository.update(id, { riderRating: rating });
        return this.findOne(id);
    }
    async getRiderEarnings(riderId) {
        const deliveries = await this.deliveriesRepository.find({
            where: { riderId, status: entities_1.DeliveryStatus.DELIVERED },
        });
        const totalEarnings = deliveries.reduce((sum, d) => sum + d.riderFee, 0);
        const totalDeliveries = deliveries.length;
        return { totalEarnings, totalDeliveries, deliveries };
    }
};
exports.DeliveriesService = DeliveriesService;
exports.DeliveriesService = DeliveriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Delivery)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DeliveriesService);
//# sourceMappingURL=deliveries.service.js.map