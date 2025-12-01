import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicine, PharmacyMedicine, Category } from '../../entities';
import { MedicinesService } from './medicines.service';
import { MedicinesController } from './medicines.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Medicine, PharmacyMedicine, Category])],
  controllers: [MedicinesController],
  providers: [MedicinesService],
  exports: [MedicinesService],
})
export class MedicinesModule {}
