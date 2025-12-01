import { DeliveriesService } from './deliveries.service';
import { DeliveryStatus } from '../../entities';
export declare class DeliveriesController {
    private deliveriesService;
    constructor(deliveriesService: DeliveriesService);
    findAll(riderId?: string): Promise<import("../../entities").Delivery[]>;
    findPending(): Promise<import("../../entities").Delivery[]>;
    getEarnings(req: any): Promise<{
        totalEarnings: number;
        totalDeliveries: number;
        deliveries: import("../../entities").Delivery[];
    }>;
    findOne(id: string): Promise<import("../../entities").Delivery | null>;
    assignRider(id: string, body: {
        riderId: string;
    }): Promise<import("../../entities").Delivery | null>;
    updateStatus(id: string, body: {
        status: DeliveryStatus;
    }): Promise<import("../../entities").Delivery | null>;
    rateDelivery(id: string, body: {
        rating: number;
    }): Promise<import("../../entities").Delivery | null>;
}
