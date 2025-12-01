import { Repository } from 'typeorm';
import { Category } from '../../entities';
export declare class CategoriesService {
    private categoriesRepository;
    constructor(categoriesRepository: Repository<Category>);
    findAll(): Promise<Category[]>;
    findOne(id: string): Promise<Category | null>;
    findBySlug(slug: string): Promise<Category | null>;
    create(data: Partial<Category>): Promise<Category>;
    seed(): Promise<{
        message: string;
    }>;
}
