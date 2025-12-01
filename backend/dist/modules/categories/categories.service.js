"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let CategoriesService = class CategoriesService {
    categoriesRepository;
    constructor(categoriesRepository) {
        this.categoriesRepository = categoriesRepository;
    }
    async findAll() {
        return this.categoriesRepository.find({ order: { displayOrder: 'ASC' } });
    }
    async findOne(id) {
        return this.categoriesRepository.findOne({ where: { id } });
    }
    async findBySlug(slug) {
        return this.categoriesRepository.findOne({ where: { slug } });
    }
    async create(data) {
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
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map