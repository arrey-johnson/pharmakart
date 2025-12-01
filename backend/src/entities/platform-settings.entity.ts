import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('platform_settings')
export class PlatformSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 800 })
  defaultDeliveryFeeNear: number; // e.g. 0-5km

  @Column({ type: 'int', default: 1200 })
  defaultDeliveryFeeFar: number; // e.g. 5-10km

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 2 })
  commissionPercentage: number; // e.g. 2.00 (%)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
