import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThanOrEqual } from 'typeorm';
import { Pharmacy, PharmacyMedicine, Order, OrderStatus, Medicine } from '../../entities';

@Injectable()
export class PharmaciesService {
  constructor(
    @InjectRepository(Pharmacy)
    private pharmaciesRepository: Repository<Pharmacy>,
    @InjectRepository(PharmacyMedicine)
    private pharmacyMedicinesRepository: Repository<PharmacyMedicine>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Medicine)
    private medicinesRepository: Repository<Medicine>,
  ) {}

  async findAll(verified = true) {
    return this.pharmaciesRepository.find({
      where: verified ? { isVerified: true } : {},
      order: { rating: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.pharmaciesRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string) {
    return this.pharmaciesRepository.findOne({ where: { userId } });
  }

  async getInventory(pharmacyId: string) {
    return this.pharmacyMedicinesRepository.find({
      where: { pharmacyId, isActive: true },
      relations: ['medicine', 'medicine.category'],
    });
  }

  async addMedicine(pharmacyId: string, medicineId: string, price: number, stockQuantity: number) {
    const item = this.pharmacyMedicinesRepository.create({
      pharmacyId,
      medicineId,
      price,
      stockQuantity,
    });
    return this.pharmacyMedicinesRepository.save(item);
  }

  async createMedicineAndAdd(
    pharmacyId: string,
    medicineData: {
      name: string;
      genericName?: string;
      categoryId?: string;
      description?: string;
      dosage?: string;
      packaging?: string;
      prescriptionRequired?: boolean;
    },
    price: number,
    stockQuantity: number,
  ) {
    // Create the medicine
    const medicine = this.medicinesRepository.create(medicineData);
    const savedMedicine = await this.medicinesRepository.save(medicine);

    // Add to pharmacy inventory
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

  async updateInventory(id: string, data: Partial<PharmacyMedicine>) {
    await this.pharmacyMedicinesRepository.update(id, data);
    return this.pharmacyMedicinesRepository.findOne({ where: { id } });
  }

  async getInventoryItem(id: string) {
    return this.pharmacyMedicinesRepository.findOne({
      where: { id },
      relations: ['medicine', 'medicine.category'],
    });
  }

  async updateInventoryItem(
    inventoryId: string,
    medicineData: {
      name?: string;
      genericName?: string;
      categoryId?: string;
      description?: string;
      dosage?: string;
      packaging?: string;
      prescriptionRequired?: boolean;
    },
    inventoryData: {
      price?: number;
      stockQuantity?: number;
    },
  ) {
    // Get the inventory item to find the medicine ID
    const inventoryItem = await this.pharmacyMedicinesRepository.findOne({
      where: { id: inventoryId },
      relations: ['medicine'],
    });

    if (!inventoryItem) {
      throw new Error('Inventory item not found');
    }

    // Update the medicine details
    if (Object.keys(medicineData).length > 0) {
      await this.medicinesRepository.update(inventoryItem.medicineId, medicineData);
    }

    // Update the inventory item (price, stock)
    if (Object.keys(inventoryData).length > 0) {
      await this.pharmacyMedicinesRepository.update(inventoryId, inventoryData);
    }

    // Return the updated inventory item with medicine details
    return this.pharmacyMedicinesRepository.findOne({
      where: { id: inventoryId },
      relations: ['medicine', 'medicine.category'],
    });
  }

  async update(id: string, data: Partial<Pharmacy>) {
    await this.pharmaciesRepository.update(id, data);
    return this.findOne(id);
  }

  async getStats(pharmacyId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all orders for today
    const todayOrders = await this.ordersRepository.find({
      where: {
        pharmacyId,
        createdAt: MoreThan(today),
      },
    });

    const todayRevenue = todayOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const pendingOrders = todayOrders.filter(o => 
      [OrderStatus.PENDING_PHARMACY_CONFIRMATION, OrderStatus.ACCEPTED, OrderStatus.PREPARED].includes(o.status)
    ).length;
    const completedOrders = todayOrders.filter(o => o.status === OrderStatus.DELIVERED).length;

    return {
      todayOrders: todayOrders.length,
      todayRevenue,
      pendingOrders,
      completedOrders,
    };
  }

  async getLowStock(pharmacyId: string, threshold = 10) {
    return this.pharmacyMedicinesRepository.find({
      where: {
        pharmacyId,
        isActive: true,
        stockQuantity: LessThanOrEqual(threshold),
      },
      relations: ['medicine'],
      order: { stockQuantity: 'ASC' },
    });
  }

  async updateStock(id: string, stockQuantity: number) {
    await this.pharmacyMedicinesRepository.update(id, { stockQuantity });
    return this.pharmacyMedicinesRepository.findOne({ 
      where: { id },
      relations: ['medicine'],
    });
  }
}
