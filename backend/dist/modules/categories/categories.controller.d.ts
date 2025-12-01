import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<import("../../entities").Category[]>;
    findBySlug(slug: string): Promise<import("../../entities").Category | null>;
    seed(): Promise<{
        message: string;
    }>;
}
