import { Category } from './category.entity';
export declare class Medicine {
    id: string;
    name: string;
    genericName: string;
    categoryId: string;
    category: Category;
    description: string;
    imageUrl: string;
    dosage: string;
    packaging: string;
    prescriptionRequired: boolean;
    createdAt: Date;
    updatedAt: Date;
}
