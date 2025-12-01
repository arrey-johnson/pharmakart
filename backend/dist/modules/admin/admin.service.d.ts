import { Repository } from 'typeorm';
import { User, Pharmacy, Rider, Order, OrderStatus, PlatformSettings } from '../../entities';
export declare class AdminService {
    private usersRepository;
    private pharmaciesRepository;
    private ridersRepository;
    private ordersRepository;
    private platformSettingsRepository;
    constructor(usersRepository: Repository<User>, pharmaciesRepository: Repository<Pharmacy>, ridersRepository: Repository<Rider>, ordersRepository: Repository<Order>, platformSettingsRepository: Repository<PlatformSettings>);
    ensureIsAdmin(role: string): void;
    getOverview(): Promise<{
        stats: {
            totalUsers: number;
            totalPharmacies: number;
            totalRiders: number;
            totalOrders: number;
            monthlyRevenue: number;
            pendingVerifications: number;
        };
        recentOrders: {
            id: string;
            customerName: string;
            pharmacyName: string;
            total: number;
            status: OrderStatus;
            createdAt: Date;
        }[];
        pendingVerifications: ({
            id: string;
            type: "PHARMACY";
            name: string;
            createdAt: Date;
        } | {
            id: string;
            type: "RIDER";
            name: string;
            createdAt: Date;
        })[];
    }>;
    getUsers(): Promise<User[]>;
    getPharmacies(): Promise<Pharmacy[]>;
    getRiders(): Promise<Rider[]>;
    getOrders(): Promise<Order[]>;
    getSettings(): Promise<PlatformSettings>;
    updateSettings(data: Partial<PlatformSettings>): Promise<PlatformSettings>;
    verifyRider(id: string): Promise<Rider | null>;
}
