import { Repository } from 'typeorm';
import { Delivery, DeliveryStatus, Order } from '../../entities';
export declare class DeliveriesService {
    private deliveriesRepository;
    private ordersRepository;
    constructor(deliveriesRepository: Repository<Delivery>, ordersRepository: Repository<Order>);
    findAll(riderId?: string): Promise<Delivery[]>;
    findPending(): Promise<Delivery[]>;
    findOne(id: string): Promise<Delivery | null>;
    assignRider(deliveryId: string, riderId: string): Promise<Delivery | null>;
    updateStatus(id: string, status: DeliveryStatus): Promise<Delivery | null>;
    rateDelivery(id: string, rating: number): Promise<Delivery | null>;
    getRiderEarnings(riderId: string): Promise<{
        totalEarnings: number;
        totalDeliveries: number;
        deliveries: Delivery[];
    }>;
}
