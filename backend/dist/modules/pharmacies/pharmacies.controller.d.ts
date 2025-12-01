import { PharmaciesService } from './pharmacies.service';
export declare class PharmaciesController {
    private pharmaciesService;
    constructor(pharmaciesService: PharmaciesService);
    findAll(verified: string): Promise<import("../../entities").Pharmacy[]>;
    verifyPharmacy(id: string): Promise<import("../../entities").Pharmacy | null>;
    findOne(id: string): Promise<import("../../entities").Pharmacy | null>;
    getInventory(id: string): Promise<import("../../entities").PharmacyMedicine[]>;
    addMedicine(id: string, body: {
        medicineId: string;
        price: number;
        stockQuantity: number;
    }): Promise<import("../../entities").PharmacyMedicine>;
    createMedicineAndAdd(id: string, body: {
        medicine: {
            name: string;
            genericName?: string;
            categoryId?: string;
            description?: string;
            dosage?: string;
            packaging?: string;
            prescriptionRequired?: boolean;
        };
        price: number;
        stockQuantity: number;
    }): Promise<{
        medicine: import("../../entities").Medicine;
        inventoryItem: import("../../entities").PharmacyMedicine;
    }>;
    update(id: string, body: any): Promise<import("../../entities").Pharmacy | null>;
    getStats(id: string): Promise<{
        todayOrders: number;
        todayRevenue: number;
        pendingOrders: number;
        completedOrders: number;
    }>;
    getLowStock(id: string, threshold?: string): Promise<import("../../entities").PharmacyMedicine[]>;
    updateStock(itemId: string, body: {
        stockQuantity: number;
    }): Promise<import("../../entities").PharmacyMedicine | null>;
    getInventoryItem(itemId: string): Promise<import("../../entities").PharmacyMedicine | null>;
    updateInventoryItem(itemId: string, body: {
        medicine: {
            name?: string;
            genericName?: string;
            categoryId?: string;
            description?: string;
            dosage?: string;
            packaging?: string;
            prescriptionRequired?: boolean;
        };
        price?: number;
        stockQuantity?: number;
    }): Promise<import("../../entities").PharmacyMedicine | null>;
}
