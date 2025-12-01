import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Medicine, PharmacyMedicine } from '../../entities';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectRepository(Medicine)
    private medicinesRepository: Repository<Medicine>,
    @InjectRepository(PharmacyMedicine)
    private pharmacyMedicinesRepository: Repository<PharmacyMedicine>,
  ) {}

  async findAll(categoryId?: string) {
    const where = categoryId ? { categoryId } : {};
    return this.medicinesRepository.find({
      where,
      relations: ['category'],
    });
  }

  async findOne(id: string) {
    return this.medicinesRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async search(query: string) {
    return this.medicinesRepository.find({
      where: [
        { name: Like(`%${query}%`) },
        { genericName: Like(`%${query}%`) },
      ],
      relations: ['category'],
    });
  }

  async searchAvailable(query?: string, categoryId?: string) {
    // Get all pharmacy medicines with stock > 0
    const queryBuilder = this.pharmacyMedicinesRepository
      .createQueryBuilder('pm')
      .leftJoinAndSelect('pm.medicine', 'medicine')
      .leftJoinAndSelect('medicine.category', 'category')
      .leftJoinAndSelect('pm.pharmacy', 'pharmacy')
      .where('pm.stockQuantity > 0')
      .andWhere('pm.isActive = :isActive', { isActive: true })
      .andWhere('pharmacy.isVerified = :isVerified', { isVerified: true });

    if (query) {
      queryBuilder.andWhere(
        '(medicine.name LIKE :query OR medicine.genericName LIKE :query)',
        { query: `%${query}%` },
      );
    }

    if (categoryId) {
      queryBuilder.andWhere('medicine.categoryId = :categoryId', { categoryId });
    }

    const pharmacyMedicines = await queryBuilder.getMany();

    // Group by medicine and calculate min price and pharmacy count
    const medicineMap = new Map<string, {
      id: string;
      name: string;
      genericName: string;
      category: string;
      categoryId: string;
      prescriptionRequired: boolean;
      dosage: string;
      minPrice: number;
      pharmacyCount: number;
    }>();

    for (const pm of pharmacyMedicines) {
      const medicineId = pm.medicine.id;
      const existing = medicineMap.get(medicineId);

      if (existing) {
        existing.minPrice = Math.min(existing.minPrice, Number(pm.price));
        existing.pharmacyCount += 1;
      } else {
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

  async getPharmacyOffers(medicineId: string) {
    return this.pharmacyMedicinesRepository.find({
      where: { medicineId, isActive: true },
      relations: ['pharmacy'],
      order: { price: 'ASC' },
    });
  }

  async create(data: Partial<Medicine>) {
    const medicine = this.medicinesRepository.create(data);
    return this.medicinesRepository.save(medicine);
  }

  async update(id: string, data: Partial<Medicine>) {
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
}
