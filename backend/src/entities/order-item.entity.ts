import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { PharmacyMedicine } from './pharmacy-medicine.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  pharmacyMedicineId: string;

  @ManyToOne(() => PharmacyMedicine)
  @JoinColumn({ name: 'pharmacyMedicineId' })
  pharmacyMedicine: PharmacyMedicine;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  unitPrice: number; // XAF

  @Column({ type: 'int' })
  subtotal: number; // quantity * unitPrice
}
