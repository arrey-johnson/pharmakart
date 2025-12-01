import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

export enum Subdivision {
  DOUALA_I = 'DOUALA_I',
  DOUALA_II = 'DOUALA_II',
  DOUALA_III = 'DOUALA_III',
  DOUALA_IV = 'DOUALA_IV',
  DOUALA_V = 'DOUALA_V',
}

@Entity('pharmacies')
export class Pharmacy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  name: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column()
  address: string;

  @Column({
    type: 'enum',
    enum: Subdivision,
  })
  subdivision: Subdivision;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ nullable: true })
  openingHours: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalReviews: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
