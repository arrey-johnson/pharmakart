import { MedicinesService } from './medicines.service';
export declare class MedicinesController {
    private medicinesService;
    constructor(medicinesService: MedicinesService);
    findAll(categoryId?: string): Promise<import("../../entities").Medicine[]>;
    search(query: string): Promise<import("../../entities").Medicine[]>;
    searchAvailable(query?: string, categoryId?: string): Promise<{
        id: string;
        name: string;
        genericName: string;
        category: string;
        categoryId: string;
        prescriptionRequired: boolean;
        dosage: string;
        minPrice: number;
        pharmacyCount: number;
    }[]>;
    findOne(id: string): Promise<import("../../entities").Medicine | null>;
    getPharmacyOffers(id: string): Promise<import("../../entities").PharmacyMedicine[]>;
    create(body: any): Promise<import("../../entities").Medicine>;
    seed(): Promise<{
        message: string;
    }>;
}
