import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem, PharmacyMedicine, Delivery } from '../../entities';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PharmaciesModule } from '../pharmacies/pharmacies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, PharmacyMedicine, Delivery]),
    PharmaciesModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
