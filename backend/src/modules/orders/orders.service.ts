import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItem, PharmacyMedicine, Delivery, OrderStatus, PaymentStatus } from '../../entities';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(PharmacyMedicine)
    private pharmacyMedicinesRepository: Repository<PharmacyMedicine>,
    @InjectRepository(Delivery)
    private deliveriesRepository: Repository<Delivery>,
  ) {}

  async create(clientId: string, data: {
    pharmacyId: string;
    deliveryAddress: string;
    subdivision: string;
    paymentMethod: string;
    clientPhone: string;
    notes?: string;
    items: { pharmacyMedicineId: string; quantity: number }[];
  }) {
    // Calculate totals
    let subtotal = 0;
    const orderItems: Partial<OrderItem>[] = [];

    for (const item of data.items) {
      const pm = await this.pharmacyMedicinesRepository.findOne({ where: { id: item.pharmacyMedicineId } });
      if (!pm) throw new BadRequestException(`Product not found: ${item.pharmacyMedicineId}`);
      
      const itemSubtotal = pm.price * item.quantity;
      subtotal += itemSubtotal;
      orderItems.push({
        pharmacyMedicineId: item.pharmacyMedicineId,
        quantity: item.quantity,
        unitPrice: pm.price,
        subtotal: itemSubtotal,
      });
    }

    const deliveryFee = 800; // Default fee - should be calculated based on distance
    const commissionAmount = Math.round(subtotal * 0.02); // 2% commission
    const totalAmount = subtotal + deliveryFee;

    // Create order
    const order = this.ordersRepository.create({
      clientId,
      pharmacyId: data.pharmacyId,
      deliveryAddress: data.deliveryAddress,
      subdivision: data.subdivision as any,
      paymentMethod: data.paymentMethod as any,
      clientPhone: data.clientPhone,
      notes: data.notes,
      subtotal,
      deliveryFee,
      commissionAmount,
      totalAmount,
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Create order items
    for (const item of orderItems) {
      const orderItem = this.orderItemsRepository.create({
        ...item,
        orderId: savedOrder.id,
      });
      await this.orderItemsRepository.save(orderItem);
    }

    // Create delivery record
    const delivery = this.deliveriesRepository.create({
      orderId: savedOrder.id,
    });
    await this.deliveriesRepository.save(delivery);

    return this.findOne(savedOrder.id);
  }

  async findAll(filters: { clientId?: string; pharmacyId?: string; status?: OrderStatus }) {
    const where: any = {};
    if (filters.clientId) where.clientId = filters.clientId;
    if (filters.pharmacyId) where.pharmacyId = filters.pharmacyId;
    if (filters.status) where.status = filters.status;

    return this.ordersRepository.find({
      where,
      relations: ['pharmacy', 'client'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.ordersRepository.findOne({
      where: { id },
      relations: ['pharmacy', 'client'],
    });
  }

  async getOrderItems(orderId: string) {
    return this.orderItemsRepository.find({
      where: { orderId },
      relations: ['pharmacyMedicine', 'pharmacyMedicine.medicine'],
    });
  }

  async updateStatus(id: string, status: OrderStatus, rejectionReason?: string) {
    const updateData: Partial<Order> = { status };
    if (rejectionReason) updateData.rejectionReason = rejectionReason;
    
    await this.ordersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
    await this.ordersRepository.update(id, { paymentStatus });
    return this.findOne(id);
  }
}
