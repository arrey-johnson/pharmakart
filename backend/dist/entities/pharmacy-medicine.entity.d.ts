import { Pharmacy } from './pharmacy.entity';
import { Medicine } from './medicine.entity';
export declare class PharmacyMedicine {
    id: string;
    pharmacyId: string;
    pharmacy: Pharmacy;
    medicineId: string;
    medicine: Medicine;
    price: number;
    stockQuantity: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
