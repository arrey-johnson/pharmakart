import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getOverview(req: any): Promise<{
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
            status: import("../../entities").OrderStatus;
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
    getUsers(req: any): Promise<import("../../entities").User[]>;
    getPharmacies(req: any): Promise<import("../../entities").Pharmacy[]>;
    getRiders(req: any): Promise<import("../../entities").Rider[]>;
    getOrders(req: any): Promise<import("../../entities").Order[]>;
    getSettings(req: any): Promise<import("../../entities").PlatformSettings>;
    updateSettings(req: any, body: {
        defaultDeliveryFeeNear?: number;
        defaultDeliveryFeeFar?: number;
        commissionPercentage?: number;
    }): Promise<import("../../entities").PlatformSettings>;
    verifyRider(req: any, id: string): Promise<import("../../entities").Rider | null>;
}
