import { Order } from './order.entity';
import { Rider } from './rider.entity';
export declare enum DeliveryStatus {
    PENDING = "PENDING",
    ON_THE_WAY_TO_PHARMACY = "ON_THE_WAY_TO_PHARMACY",
    PICKED_UP = "PICKED_UP",
    ON_THE_WAY_TO_CLIENT = "ON_THE_WAY_TO_CLIENT",
    DELIVERED = "DELIVERED"
}
export declare class Delivery {
    id: string;
    orderId: string;
    order: Order;
    riderId: string;
    rider: Rider;
    status: DeliveryStatus;
    pickupTime: Date;
    deliveredTime: Date;
    riderFee: number;
    riderRating: number;
    clientNotes: string;
    createdAt: Date;
    updatedAt: Date;
}
