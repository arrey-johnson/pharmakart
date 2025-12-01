import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pharmacy, PharmacyMedicine, Medicine, Order, Category } from '../../entities';
import { PharmaciesService } from './pharmacies.service';
import { PharmaciesController } from './pharmacies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pharmacy, PharmacyMedicine, Medicine, Order, Category])],
  controllers: [PharmaciesController],
  providers: [PharmaciesService],
  exports: [PharmaciesService],
})
export class PharmaciesModule {}
