import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Pharmacy } from './pharmacy.entity';
import { Subdivision } from './pharmacy.entity';

export enum OrderStatus {
  PENDING_PHARMACY_CONFIRMATION = 'PENDING_PHARMACY_CONFIRMATION',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
  PREPARED = 'PREPARED',
  ASSIGNED_TO_RIDER = 'ASSIGNED_TO_RIDER',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  MTN_MOMO = 'MTN_MOMO',
  ORANGE_MONEY = 'ORANGE_MONEY',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clientId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'clientId' })
  client: User;

  @Column()
  pharmacyId: string;

  @ManyToOne(() => Pharmacy)
  @JoinColumn({ name: 'pharmacyId' })
  pharmacy: Pharmacy;

  @Column()
  deliveryAddress: string;

  @Column({
    type: 'enum',
    enum: Subdivision,
  })
  subdivision: Subdivision;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING_PHARMACY_CONFIRMATION,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({ type: 'int' })
  subtotal: number; // XAF

  @Column({ type: 'int' })
  deliveryFee: number; // XAF

  @Column({ type: 'int' })
  commissionAmount: number; // XAF

  @Column({ type: 'int' })
  totalAmount: number; // XAF

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  rejectionReason: string;

  @Column({ nullable: true })
  clientPhone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
