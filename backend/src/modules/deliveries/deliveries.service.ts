import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery, DeliveryStatus, Order, OrderStatus } from '../../entities';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private deliveriesRepository: Repository<Delivery>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async findAll(riderId?: string) {
    const where = riderId ? { riderId } : {};
    return this.deliveriesRepository.find({
      where,
      relations: ['order', 'order.pharmacy', 'order.client', 'rider'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPending() {
    return this.deliveriesRepository.find({
      where: { status: DeliveryStatus.PENDING, riderId: null as any },
      relations: ['order', 'order.pharmacy', 'order.client'],
    });
  }

  async findOne(id: string) {
    return this.deliveriesRepository.findOne({
      where: { id },
      relations: ['order', 'order.pharmacy', 'order.client', 'rider'],
    });
  }

  async assignRider(deliveryId: string, riderId: string) {
    await this.deliveriesRepository.update(deliveryId, {
      riderId,
      status: DeliveryStatus.ON_THE_WAY_TO_PHARMACY,
    });

    // Update order status
    const delivery = await this.findOne(deliveryId);
    if (delivery) {
      await this.ordersRepository.update(delivery.orderId, {
        status: OrderStatus.ASSIGNED_TO_RIDER,
      });
    }

    return this.findOne(deliveryId);
  }

  async updateStatus(id: string, status: DeliveryStatus) {
    const updateData: Partial<Delivery> = { status };

    if (status === DeliveryStatus.PICKED_UP) {
      updateData.pickupTime = new Date();
    } else if (status === DeliveryStatus.DELIVERED) {
      updateData.deliveredTime = new Date();
    }

    await this.deliveriesRepository.update(id, updateData);

    // Update corresponding order status
    const delivery = await this.findOne(id);
    if (delivery) {
      let orderStatus: OrderStatus | undefined;
      switch (status) {
        case DeliveryStatus.ON_THE_WAY_TO_CLIENT:
          orderStatus = OrderStatus.OUT_FOR_DELIVERY;
          break;
        case DeliveryStatus.DELIVERED:
          orderStatus = OrderStatus.DELIVERED;
          break;
      }
      if (orderStatus) {
        await this.ordersRepository.update(delivery.orderId, { status: orderStatus });
      }
    }

    return this.findOne(id);
  }

  async rateDelivery(id: string, rating: number) {
    await this.deliveriesRepository.update(id, { riderRating: rating });
    return this.findOne(id);
  }

  async getRiderEarnings(riderId: string) {
    const deliveries = await this.deliveriesRepository.find({
      where: { riderId, status: DeliveryStatus.DELIVERED },
    });

    const totalEarnings = deliveries.reduce((sum, d) => sum + d.riderFee, 0);
    const totalDeliveries = deliveries.length;

    return { totalEarnings, totalDeliveries, deliveries };
  }
}
