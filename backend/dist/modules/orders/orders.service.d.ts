import { Repository } from 'typeorm';
import { Order, OrderItem, PharmacyMedicine, Delivery, OrderStatus, PaymentStatus } from '../../entities';
export declare class OrdersService {
    private ordersRepository;
    private orderItemsRepository;
    private pharmacyMedicinesRepository;
    private deliveriesRepository;
    constructor(ordersRepository: Repository<Order>, orderItemsRepository: Repository<OrderItem>, pharmacyMedicinesRepository: Repository<PharmacyMedicine>, deliveriesRepository: Repository<Delivery>);
    create(clientId: string, data: {
        pharmacyId: string;
        deliveryAddress: string;
        subdivision: string;
        paymentMethod: string;
        clientPhone: string;
        notes?: string;
        items: {
            pharmacyMedicineId: string;
            quantity: number;
        }[];
    }): Promise<Order | null>;
    findAll(filters: {
        clientId?: string;
        pharmacyId?: string;
        status?: OrderStatus;
    }): Promise<Order[]>;
    findOne(id: string): Promise<Order | null>;
    getOrderItems(orderId: string): Promise<OrderItem[]>;
    updateStatus(id: string, status: OrderStatus, rejectionReason?: string): Promise<Order | null>;
    updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<Order | null>;
}
