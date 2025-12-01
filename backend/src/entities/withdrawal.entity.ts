import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pharmacy } from './pharmacy.entity';

export enum WithdrawalStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export enum WithdrawalMethod {
  MTN_MOMO = 'MTN_MOMO',
  ORANGE_MONEY = 'ORANGE_MONEY',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

@Entity('withdrawals')
export class Withdrawal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pharmacyId: string;

  @ManyToOne(() => Pharmacy)
  @JoinColumn({ name: 'pharmacyId' })
  pharmacy: Pharmacy;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: WithdrawalMethod,
  })
  method: WithdrawalMethod;

  @Column()
  accountNumber: string;

  @Column({ nullable: true })
  accountName: string;

  @Column({ nullable: true })
  bankName: string;

  @Column({
    type: 'enum',
    enum: WithdrawalStatus,
    default: WithdrawalStatus.PENDING,
  })
  status: WithdrawalStatus;

  @Column({ nullable: true })
  rejectionReason: string;

  @Column({ nullable: true })
  transactionReference: string;

  @Column({ nullable: true })
  processedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
