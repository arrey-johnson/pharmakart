import { User } from './user.entity';
import { Pharmacy } from './pharmacy.entity';
import { Subdivision } from './pharmacy.entity';
export declare enum OrderStatus {
    PENDING_PHARMACY_CONFIRMATION = "PENDING_PHARMACY_CONFIRMATION",
    REJECTED = "REJECTED",
    ACCEPTED = "ACCEPTED",
    PREPARED = "PREPARED",
    ASSIGNED_TO_RIDER = "ASSIGNED_TO_RIDER",
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export declare enum PaymentMethod {
    MTN_MOMO = "MTN_MOMO",
    ORANGE_MONEY = "ORANGE_MONEY",
    CASH_ON_DELIVERY = "CASH_ON_DELIVERY"
}
export declare class Order {
    id: string;
    clientId: string;
    client: User;
    pharmacyId: string;
    pharmacy: Pharmacy;
    deliveryAddress: string;
    subdivision: Subdivision;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    subtotal: number;
    deliveryFee: number;
    commissionAmount: number;
    totalAmount: number;
    notes: string;
    rejectionReason: string;
    clientPhone: string;
    createdAt: Date;
    updatedAt: Date;
}
