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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let AdminService = class AdminService {
    usersRepository;
    pharmaciesRepository;
    ridersRepository;
    ordersRepository;
    platformSettingsRepository;
    constructor(usersRepository, pharmaciesRepository, ridersRepository, ordersRepository, platformSettingsRepository) {
        this.usersRepository = usersRepository;
        this.pharmaciesRepository = pharmaciesRepository;
        this.ridersRepository = ridersRepository;
        this.ordersRepository = ordersRepository;
        this.platformSettingsRepository = platformSettingsRepository;
    }
    ensureIsAdmin(role) {
        if (role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Admin access only');
        }
    }
    async getOverview() {
        const [totalUsers, totalPharmacies, totalRiders, totalOrders] = await Promise.all([
            this.usersRepository.count({ where: { role: entities_1.UserRole.CLIENT } }),
            this.pharmaciesRepository.count(),
            this.ridersRepository.count(),
            this.ordersRepository.count(),
        ]);
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const deliveredThisMonth = await this.ordersRepository.find({
            where: {
                status: entities_1.OrderStatus.DELIVERED,
                createdAt: (0, typeorm_2.MoreThanOrEqual)(startOfMonth),
            },
        });
        const monthlyRevenue = deliveredThisMonth.reduce((sum, order) => sum + Number(order.commissionAmount ?? 0), 0);
        const [pendingPharmacies, pendingRiders] = await Promise.all([
            this.pharmaciesRepository.count({ where: { isVerified: false } }),
            this.ridersRepository.count({ where: { isVerified: false } }),
        ]);
        const pendingVerifications = pendingPharmacies + pendingRiders;
        const recentOrdersRaw = await this.ordersRepository.find({
            relations: ['pharmacy', 'client'],
            order: { createdAt: 'DESC' },
            take: 5,
        });
        const recentOrders = recentOrdersRaw.map((order) => ({
            id: order.id,
            customerName: order.client?.name || 'Unknown',
            pharmacyName: order.pharmacy?.name || 'Unknown pharmacy',
            total: Number(order.totalAmount ?? 0),
            status: order.status,
            createdAt: order.createdAt,
        }));
        const [unverifiedPharmacies, unverifiedRiders] = await Promise.all([
            this.pharmaciesRepository.find({ where: { isVerified: false }, order: { createdAt: 'DESC' } }),
            this.ridersRepository.find({ where: { isVerified: false }, order: { createdAt: 'DESC' } }),
        ]);
        const pendingItems = [
            ...unverifiedPharmacies.map((p) => ({
                id: p.id,
                type: 'PHARMACY',
                name: p.name,
                createdAt: p.createdAt,
            })),
            ...unverifiedRiders.map((r) => ({
                id: r.id,
                type: 'RIDER',
                name: r.userId,
                createdAt: r.createdAt,
            })),
        ]
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 5);
        return {
            stats: {
                totalUsers,
                totalPharmacies,
                totalRiders,
                totalOrders,
                monthlyRevenue,
                pendingVerifications,
            },
            recentOrders,
            pendingVerifications: pendingItems,
        };
    }
    async getUsers() {
        return this.usersRepository.find({
            where: { role: entities_1.UserRole.CLIENT },
            order: { createdAt: 'DESC' },
        });
    }
    async getPharmacies() {
        return this.pharmaciesRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async getRiders() {
        return this.ridersRepository.find({
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
    async getOrders() {
        return this.ordersRepository.find({
            relations: ['pharmacy', 'client'],
            order: { createdAt: 'DESC' },
            take: 50,
        });
    }
    async getSettings() {
        let settings = await this.platformSettingsRepository.findOne({ where: {} });
        if (!settings) {
            settings = this.platformSettingsRepository.create({});
            settings = await this.platformSettingsRepository.save(settings);
        }
        return settings;
    }
    async updateSettings(data) {
        const settings = await this.getSettings();
        Object.assign(settings, data);
        return this.platformSettingsRepository.save(settings);
    }
    async verifyRider(id) {
        await this.ridersRepository.update(id, { isVerified: true });
        return this.ridersRepository.findOne({ where: { id }, relations: ['user'] });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Pharmacy)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Rider)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.Order)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.PlatformSettings)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map