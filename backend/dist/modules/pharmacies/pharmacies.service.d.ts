import { Repository } from 'typeorm';
import { Pharmacy, PharmacyMedicine, Order, Medicine } from '../../entities';
export declare class PharmaciesService {
    private pharmaciesRepository;
    private pharmacyMedicinesRepository;
    private ordersRepository;
    private medicinesRepository;
    constructor(pharmaciesRepository: Repository<Pharmacy>, pharmacyMedicinesRepository: Repository<PharmacyMedicine>, ordersRepository: Repository<Order>, medicinesRepository: Repository<Medicine>);
    findAll(verified?: boolean): Promise<Pharmacy[]>;
    findOne(id: string): Promise<Pharmacy | null>;
    findByUserId(userId: string): Promise<Pharmacy | null>;
    getInventory(pharmacyId: string): Promise<PharmacyMedicine[]>;
    addMedicine(pharmacyId: string, medicineId: string, price: number, stockQuantity: number): Promise<PharmacyMedicine>;
    createMedicineAndAdd(pharmacyId: string, medicineData: {
        name: string;
        genericName?: string;
        categoryId?: string;
        description?: string;
        dosage?: string;
        packaging?: string;
        prescriptionRequired?: boolean;
    }, price: number, stockQuantity: number): Promise<{
        medicine: Medicine;
        inventoryItem: PharmacyMedicine;
    }>;
    updateInventory(id: string, data: Partial<PharmacyMedicine>): Promise<PharmacyMedicine | null>;
    getInventoryItem(id: string): Promise<PharmacyMedicine | null>;
    updateInventoryItem(inventoryId: string, medicineData: {
        name?: string;
        genericName?: string;
        categoryId?: string;
        description?: string;
        dosage?: string;
        packaging?: string;
        prescriptionRequired?: boolean;
    }, inventoryData: {
        price?: number;
        stockQuantity?: number;
    }): Promise<PharmacyMedicine | null>;
    update(id: string, data: Partial<Pharmacy>): Promise<Pharmacy | null>;
    getStats(pharmacyId: string): Promise<{
        todayOrders: number;
        todayRevenue: number;
        pendingOrders: number;
        completedOrders: number;
    }>;
    getLowStock(pharmacyId: string, threshold?: number): Promise<PharmacyMedicine[]>;
    updateStock(id: string, stockQuantity: number): Promise<PharmacyMedicine | null>;
}
