import { Repository } from 'typeorm';
import { Medicine, PharmacyMedicine } from '../../entities';
export declare class MedicinesService {
    private medicinesRepository;
    private pharmacyMedicinesRepository;
    constructor(medicinesRepository: Repository<Medicine>, pharmacyMedicinesRepository: Repository<PharmacyMedicine>);
    findAll(categoryId?: string): Promise<Medicine[]>;
    findOne(id: string): Promise<Medicine | null>;
    search(query: string): Promise<Medicine[]>;
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
    getPharmacyOffers(medicineId: string): Promise<PharmacyMedicine[]>;
    create(data: Partial<Medicine>): Promise<Medicine>;
    update(id: string, data: Partial<Medicine>): Promise<Medicine | null>;
    seed(): Promise<{
        message: string;
    }>;
}
