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
exports.PharmaciesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let PharmaciesService = class PharmaciesService {
    pharmaciesRepository;
    pharmacyMedicinesRepository;
    ordersRepository;
    medicinesRepository;
    constructor(pharmaciesRepository, pharmacyMedicinesRepository, ordersRepository, medicinesRepository) {
        this.pharmaciesRepository = pharmaciesRepository;
        this.pharmacyMedicinesRepository = pharmacyMedicinesRepository;
        this.ordersRepository = ordersRepository;
        this.medicinesRepository = medicinesRepository;
    }
    async findAll(verified = true) {
        return this.pharmaciesRepository.find({
            where: verified ? { isVerified: true } : {},
            order: { rating: 'DESC' },
        });
    }
    async findOne(id) {
        return this.pharmaciesRepository.findOne({
            where: { id },
            relations: ['user'],
        });
    }
    async findByUserId(userId) {
        return this.pharmaciesRepository.findOne({ where: { userId } });
    }
    async getInventory(pharmacyId) {
        return this.pharmacyMedicinesRepository.find({
            where: { pharmacyId, isActive: true },
            relations: ['medicine', 'medicine.category'],
        });
    }
    async addMedicine(pharmacyId, medicineId, price, stockQuantity) {
        const item = this.pharmacyMedicinesRepository.create({
            pharmacyId,
            medicineId,
            price,
            stockQuantity,
        });
        return this.pharmacyMedicinesRepository.save(item);
    }
    async createMedicineAndAdd(pharmacyId, medicineData, price, stockQuantity) {
        const medicine = this.medicinesRepository.create(medicineData);
        const savedMedicine = await this.medicinesRepository.save(medicine);
        const item = this.pharmacyMedicinesRepository.create({
            pharmacyId,
            medicineId: savedMedicine.id,
            price,
            stockQuantity,
        });
        const savedItem = await this.pharmacyMedicinesRepository.save(item);
        return {
            medicine: savedMedicine,
            inventoryItem: savedItem,
        };
    }
    async updateInventory(id, data) {
        await this.pharmacyMedicinesRepository.update(id, data);
        return this.pharmacyMedicinesRepository.findOne({ where: { id } });
    }
    async getInventoryItem(id) {
        return this.pharmacyMedicinesRepository.findOne({
            where: { id },
            relations: ['medicine', 'medicine.category'],
        });
    }
    async updateInventoryItem(inventoryId, medicineData, inventoryData) {
        const inventoryItem = await this.pharmacyMedicinesRepository.findOne({
            where: { id: inventoryId },
            relations: ['medicine'],
        });
        if (!inventoryItem) {
            throw new Error('Inventory item not found');
        }
        if (Object.keys(medicineData).length > 0) {
            await this.medicinesRepository.update(inventoryItem.medicineId, medicineData);
        }
        if (Object.keys(inventoryData).length > 0) {
            await this.pharmacyMedicinesRepository.update(inventoryId, inventoryData);
        }
        return this.pharmacyMedicinesRepository.findOne({
            where: { id: inventoryId },
            relations: ['medicine', 'medicine.category'],
        });
    }
    async update(id, data) {
        await this.pharmaciesRepository.update(id, data);
        return this.findOne(id);
    }
    async getStats(pharmacyId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = await this.ordersRepository.find({
            where: {
                pharmacyId,
                createdAt: (0, typeorm_2.MoreThan)(today),
            },
        });
        const todayRevenue = todayOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        const pendingOrders = todayOrders.filter(o => [entities_1.OrderStatus.PENDING_PHARMACY_CONFIRMATION, entities_1.OrderStatus.ACCEPTED, entities_1.OrderStatus.PREPARED].includes(o.status)).length;
        const completedOrders = todayOrders.filter(o => o.status === entities_1.OrderStatus.DELIVERED).length;
        return {
            todayOrders: todayOrders.length,
            todayRevenue,
            pendingOrders,
            completedOrders,
        };
    }
    async getLowStock(pharmacyId, threshold = 10) {
        return this.pharmacyMedicinesRepository.find({
            where: {
                pharmacyId,
                isActive: true,
                stockQuantity: (0, typeorm_2.LessThanOrEqual)(threshold),
            },
            relations: ['medicine'],
            order: { stockQuantity: 'ASC' },
        });
    }
    async updateStock(id, stockQuantity) {
        await this.pharmacyMedicinesRepository.update(id, { stockQuantity });
        return this.pharmacyMedicinesRepository.findOne({
            where: { id },
            relations: ['medicine'],
        });
    }
};
exports.PharmaciesService = PharmaciesService;
exports.PharmaciesService = PharmaciesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Pharmacy)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.PharmacyMedicine)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Order)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.Medicine)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PharmaciesService);
//# sourceMappingURL=pharmacies.service.js.map