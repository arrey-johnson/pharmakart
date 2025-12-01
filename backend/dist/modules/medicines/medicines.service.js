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
exports.MedicinesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let MedicinesService = class MedicinesService {
    medicinesRepository;
    pharmacyMedicinesRepository;
    constructor(medicinesRepository, pharmacyMedicinesRepository) {
        this.medicinesRepository = medicinesRepository;
        this.pharmacyMedicinesRepository = pharmacyMedicinesRepository;
    }
    async findAll(categoryId) {
        const where = categoryId ? { categoryId } : {};
        return this.medicinesRepository.find({
            where,
            relations: ['category'],
        });
    }
    async findOne(id) {
        return this.medicinesRepository.findOne({
            where: { id },
            relations: ['category'],
        });
    }
    async search(query) {
        return this.medicinesRepository.find({
            where: [
                { name: (0, typeorm_2.Like)(`%${query}%`) },
                { genericName: (0, typeorm_2.Like)(`%${query}%`) },
            ],
            relations: ['category'],
        });
    }
    async searchAvailable(query, categoryId) {
        const queryBuilder = this.pharmacyMedicinesRepository
            .createQueryBuilder('pm')
            .leftJoinAndSelect('pm.medicine', 'medicine')
            .leftJoinAndSelect('medicine.category', 'category')
            .leftJoinAndSelect('pm.pharmacy', 'pharmacy')
            .where('pm.stockQuantity > 0')
            .andWhere('pm.isActive = :isActive', { isActive: true })
            .andWhere('pharmacy.isVerified = :isVerified', { isVerified: true });
        if (query) {
            queryBuilder.andWhere('(medicine.name LIKE :query OR medicine.genericName LIKE :query)', { query: `%${query}%` });
        }
        if (categoryId) {
            queryBuilder.andWhere('medicine.categoryId = :categoryId', { categoryId });
        }
        const pharmacyMedicines = await queryBuilder.getMany();
        const medicineMap = new Map();
        for (const pm of pharmacyMedicines) {
            const medicineId = pm.medicine.id;
            const existing = medicineMap.get(medicineId);
            if (existing) {
                existing.minPrice = Math.min(existing.minPrice, Number(pm.price));
                existing.pharmacyCount += 1;
            }
            else {
                medicineMap.set(medicineId, {
                    id: medicineId,
                    name: pm.medicine.name,
                    genericName: pm.medicine.genericName || '',
                    category: pm.medicine.category?.name || '',
                    categoryId: pm.medicine.categoryId || '',
                    prescriptionRequired: pm.medicine.prescriptionRequired || false,
                    dosage: pm.medicine.dosage || '',
                    minPrice: Number(pm.price),
                    pharmacyCount: 1,
                });
            }
        }
        return Array.from(medicineMap.values());
    }
    async getPharmacyOffers(medicineId) {
        return this.pharmacyMedicinesRepository.find({
            where: { medicineId, isActive: true },
            relations: ['pharmacy'],
            order: { price: 'ASC' },
        });
    }
    async create(data) {
        const medicine = this.medicinesRepository.create(data);
        return this.medicinesRepository.save(medicine);
    }
    async update(id, data) {
        await this.medicinesRepository.update(id, data);
        return this.findOne(id);
    }
    async seed() {
        const medicines = [
            { name: 'Paracetamol 500mg', genericName: 'Acetaminophen', dosage: '500mg', packaging: 'Box of 16 tablets', prescriptionRequired: false },
            { name: 'Amoxicillin 500mg', genericName: 'Amoxicillin', dosage: '500mg', packaging: 'Box of 12 capsules', prescriptionRequired: true },
            { name: 'Coartem', genericName: 'Artemether/Lumefantrine', dosage: '20mg/120mg', packaging: 'Box of 24 tablets', prescriptionRequired: false },
            { name: 'Doliprane 1000mg', genericName: 'Paracetamol', dosage: '1000mg', packaging: 'Box of 8 tablets', prescriptionRequired: false },
            { name: 'Vitamin C 1000mg', genericName: 'Ascorbic Acid', dosage: '1000mg', packaging: 'Bottle of 30 tablets', prescriptionRequired: false },
            { name: 'Metformin 500mg', genericName: 'Metformin Hydrochloride', dosage: '500mg', packaging: 'Box of 30 tablets', prescriptionRequired: true },
        ];
        for (const med of medicines) {
            const exists = await this.medicinesRepository.findOne({ where: { name: med.name } });
            if (!exists) {
                await this.create(med);
            }
        }
        return { message: 'Medicines seeded successfully' };
    }
};
exports.MedicinesService = MedicinesService;
exports.MedicinesService = MedicinesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Medicine)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.PharmacyMedicine)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MedicinesService);
//# sourceMappingURL=medicines.service.js.map