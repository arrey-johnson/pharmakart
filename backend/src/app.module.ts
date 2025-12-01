import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entities
import {
  User,
  Pharmacy,
  Rider,
  Category,
  Medicine,
  PharmacyMedicine,
  Order,
  OrderItem,
  Delivery,
  Withdrawal,
  PlatformSettings,
} from './entities';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PharmaciesModule } from './modules/pharmacies/pharmacies.module';
import { MedicinesModule } from './modules/medicines/medicines.module';
import { OrdersModule } from './modules/orders/orders.module';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { WithdrawalsModule } from './modules/withdrawals/withdrawals.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'pharmakart'),
        entities: [
          User,
          Pharmacy,
          Rider,
          Category,
          Medicine,
          PharmacyMedicine,
          Order,
          OrderItem,
          Delivery,
          Withdrawal,
          PlatformSettings,
        ],
        synchronize: true, // Auto-create tables (disable in production)
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PharmaciesModule,
    MedicinesModule,
    OrdersModule,
    DeliveriesModule,
    CategoriesModule,
    WithdrawalsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
