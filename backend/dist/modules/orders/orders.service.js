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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let OrdersService = class OrdersService {
    ordersRepository;
    orderItemsRepository;
    pharmacyMedicinesRepository;
    deliveriesRepository;
    constructor(ordersRepository, orderItemsRepository, pharmacyMedicinesRepository, deliveriesRepository) {
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.pharmacyMedicinesRepository = pharmacyMedicinesRepository;
        this.deliveriesRepository = deliveriesRepository;
    }
    async create(clientId, data) {
        let subtotal = 0;
        const orderItems = [];
        for (const item of data.items) {
            const pm = await this.pharmacyMedicinesRepository.findOne({ where: { id: item.pharmacyMedicineId } });
            if (!pm)
                throw new common_1.BadRequestException(`Product not found: ${item.pharmacyMedicineId}`);
            const itemSubtotal = pm.price * item.quantity;
            subtotal += itemSubtotal;
            orderItems.push({
                pharmacyMedicineId: item.pharmacyMedicineId,
                quantity: item.quantity,
                unitPrice: pm.price,
                subtotal: itemSubtotal,
            });
        }
        const deliveryFee = 800;
        const commissionAmount = Math.round(subtotal * 0.02);
        const totalAmount = subtotal + deliveryFee;
        const order = this.ordersRepository.create({
            clientId,
            pharmacyId: data.pharmacyId,
            deliveryAddress: data.deliveryAddress,
            subdivision: data.subdivision,
            paymentMethod: data.paymentMethod,
            clientPhone: data.clientPhone,
            notes: data.notes,
            subtotal,
            deliveryFee,
            commissionAmount,
            totalAmount,
        });
        const savedOrder = await this.ordersRepository.save(order);
        for (const item of orderItems) {
            const orderItem = this.orderItemsRepository.create({
                ...item,
                orderId: savedOrder.id,
            });
            await this.orderItemsRepository.save(orderItem);
        }
        const delivery = this.deliveriesRepository.create({
            orderId: savedOrder.id,
        });
        await this.deliveriesRepository.save(delivery);
        return this.findOne(savedOrder.id);
    }
    async findAll(filters) {
        const where = {};
        if (filters.clientId)
            where.clientId = filters.clientId;
        if (filters.pharmacyId)
            where.pharmacyId = filters.pharmacyId;
        if (filters.status)
            where.status = filters.status;
        return this.ordersRepository.find({
            where,
            relations: ['pharmacy', 'client'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        return this.ordersRepository.findOne({
            where: { id },
            relations: ['pharmacy', 'client'],
        });
    }
    async getOrderItems(orderId) {
        return this.orderItemsRepository.find({
            where: { orderId },
            relations: ['pharmacyMedicine', 'pharmacyMedicine.medicine'],
        });
    }
    async updateStatus(id, status, rejectionReason) {
        const updateData = { status };
        if (rejectionReason)
            updateData.rejectionReason = rejectionReason;
        await this.ordersRepository.update(id, updateData);
        return this.findOne(id);
    }
    async updatePaymentStatus(id, paymentStatus) {
        await this.ordersRepository.update(id, { paymentStatus });
        return this.findOne(id);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.PharmacyMedicine)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.Delivery)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map