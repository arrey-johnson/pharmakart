import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll() {
    return this.categoriesRepository.find({ order: { displayOrder: 'ASC' } });
  }

  async findOne(id: string) {
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async findBySlug(slug: string) {
    return this.categoriesRepository.findOne({ where: { slug } });
  }

  async create(data: Partial<Category>) {
    const category = this.categoriesRepository.create(data);
    return this.categoriesRepository.save(category);
  }

  async seed() {
    const categories = [
      { name: 'Pain & Fever', slug: 'pain-fever', icon: 'thermometer', displayOrder: 1 },
      { name: 'Cough & Cold', slug: 'cough-cold', icon: 'wind', displayOrder: 2 },
      { name: 'Malaria', slug: 'malaria', icon: 'bug', displayOrder: 3 },
      { name: 'Hypertension', slug: 'hypertension', icon: 'heart-pulse', displayOrder: 4 },
      { name: 'Diabetes', slug: 'diabetes', icon: 'droplet', displayOrder: 5 },
      { name: 'Baby & Children', slug: 'baby-children', icon: 'baby', displayOrder: 6 },
      { name: 'Vitamins & Supplements', slug: 'vitamins-supplements', icon: 'pill', displayOrder: 7 },
      { name: 'Antibiotics', slug: 'antibiotics', icon: 'shield', displayOrder: 8 },
      { name: 'Skin Care', slug: 'skin-care', icon: 'sparkles', displayOrder: 9 },
      { name: 'First Aid', slug: 'first-aid', icon: 'cross', displayOrder: 10 },
    ];

    for (const cat of categories) {
      const exists = await this.findBySlug(cat.slug);
      if (!exists) {
        await this.create(cat);
      }
    }
    return { message: 'Categories seeded successfully' };
  }
}
