import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Pharmacy, Rider, Order, PlatformSettings } from '../../entities';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Pharmacy, Rider, Order, PlatformSettings])],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
