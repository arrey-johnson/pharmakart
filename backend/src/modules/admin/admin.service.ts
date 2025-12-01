import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { User, UserRole, Pharmacy, Rider, Order, OrderStatus, PlatformSettings } from '../../entities';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Pharmacy)
    private pharmaciesRepository: Repository<Pharmacy>,
    @InjectRepository(Rider)
    private ridersRepository: Repository<Rider>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(PlatformSettings)
    private platformSettingsRepository: Repository<PlatformSettings>,
  ) {}

  ensureIsAdmin(role: string) {
    if (role !== 'ADMIN') {
      throw new ForbiddenException('Admin access only');
    }
  }

  async getOverview() {
    const [totalUsers, totalPharmacies, totalRiders, totalOrders] = await Promise.all([
      // Only count customers (CLIENT role) as users in admin stats
      this.usersRepository.count({ where: { role: UserRole.CLIENT } }),
      this.pharmaciesRepository.count(),
      this.ridersRepository.count(),
      this.ordersRepository.count(),
    ]);

    // Monthly revenue = sum of commissionAmount for DELIVERED orders in current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const deliveredThisMonth = await this.ordersRepository.find({
      where: {
        status: OrderStatus.DELIVERED,
        createdAt: MoreThanOrEqual(startOfMonth),
      },
    } as any);

    const monthlyRevenue = deliveredThisMonth.reduce(
      (sum, order) => sum + Number((order as any).commissionAmount ?? 0),
      0,
    );

    const [pendingPharmacies, pendingRiders] = await Promise.all([
      this.pharmaciesRepository.count({ where: { isVerified: false } }),
      this.ridersRepository.count({ where: { isVerified: false } }),
    ]);

    const pendingVerifications = pendingPharmacies + pendingRiders;

    // Recent orders (last 5)
    const recentOrdersRaw = await this.ordersRepository.find({
      relations: ['pharmacy', 'client'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    const recentOrders = recentOrdersRaw.map((order) => ({
      id: order.id,
      customerName: order.client?.name || 'Unknown',
      pharmacyName: order.pharmacy?.name || 'Unknown pharmacy',
      total: Number((order as any).totalAmount ?? 0),
      status: order.status,
      createdAt: order.createdAt,
    }));

    // Pending verifications list (unverified pharmacies + riders, newest first)
    const [unverifiedPharmacies, unverifiedRiders] = await Promise.all([
      this.pharmaciesRepository.find({ where: { isVerified: false }, order: { createdAt: 'DESC' } }),
      this.ridersRepository.find({ where: { isVerified: false }, order: { createdAt: 'DESC' } }),
    ]);

    const pendingItems = [
      ...unverifiedPharmacies.map((p) => ({
        id: p.id,
        type: 'PHARMACY' as const,
        name: p.name,
        createdAt: p.createdAt,
      })),
      ...unverifiedRiders.map((r) => ({
        id: r.id,
        type: 'RIDER' as const,
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
      where: { role: UserRole.CLIENT },
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

  async updateSettings(data: Partial<PlatformSettings>) {
    const settings = await this.getSettings();
    Object.assign(settings, data);
    return this.platformSettingsRepository.save(settings);
  }

  async verifyRider(id: string) {
    await this.ridersRepository.update(id, { isVerified: true });
    return this.ridersRepository.findOne({ where: { id }, relations: ['user'] });
  }
}
