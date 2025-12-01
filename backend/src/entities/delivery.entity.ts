import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Rider } from './rider.entity';

export enum DeliveryStatus {
  PENDING = 'PENDING',
  ON_THE_WAY_TO_PHARMACY = 'ON_THE_WAY_TO_PHARMACY',
  PICKED_UP = 'PICKED_UP',
  ON_THE_WAY_TO_CLIENT = 'ON_THE_WAY_TO_CLIENT',
  DELIVERED = 'DELIVERED',
}

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderId: string;

  @OneToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ nullable: true })
  riderId: string;

  @ManyToOne(() => Rider)
  @JoinColumn({ name: 'riderId' })
  rider: Rider;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  @Column({ type: 'datetime', nullable: true })
  pickupTime: Date;

  @Column({ type: 'datetime', nullable: true })
  deliveredTime: Date;

  @Column({ type: 'int', default: 500 })
  riderFee: number; // XAF

  @Column({ type: 'int', nullable: true })
  riderRating: number; // 1-5

  @Column({ nullable: true })
  clientNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
