import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Pharmacy } from './pharmacy.entity';
import { Medicine } from './medicine.entity';

@Entity('pharmacy_medicines')
@Unique(['pharmacyId', 'medicineId'])
export class PharmacyMedicine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pharmacyId: string;

  @ManyToOne(() => Pharmacy)
  @JoinColumn({ name: 'pharmacyId' })
  pharmacy: Pharmacy;

  @Column()
  medicineId: string;

  @ManyToOne(() => Medicine)
  @JoinColumn({ name: 'medicineId' })
  medicine: Medicine;

  @Column({ type: 'int' })
  price: number; // Price in XAF

  @Column({ type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
