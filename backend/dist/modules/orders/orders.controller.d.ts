import { OrdersService } from './orders.service';
import { OrderStatus } from '../../entities';
import { PharmaciesService } from '../pharmacies/pharmacies.service';
export declare class OrdersController {
    private ordersService;
    private pharmaciesService;
    constructor(ordersService: OrdersService, pharmaciesService: PharmaciesService);
    create(req: any, body: any): Promise<import("../../entities").Order | null>;
    findAll(req: any, status?: OrderStatus, pharmacyId?: string): Promise<import("../../entities").Order[]>;
    findOne(id: string): Promise<import("../../entities").Order | null>;
    getOrderItems(id: string): Promise<import("../../entities").OrderItem[]>;
    updateStatus(id: string, body: {
        status: OrderStatus;
        rejectionReason?: string;
    }): Promise<import("../../entities").Order | null>;
}
