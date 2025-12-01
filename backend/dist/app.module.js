"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const entities_1 = require("./entities");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const pharmacies_module_1 = require("./modules/pharmacies/pharmacies.module");
const medicines_module_1 = require("./modules/medicines/medicines.module");
const orders_module_1 = require("./modules/orders/orders.module");
const deliveries_module_1 = require("./modules/deliveries/deliveries.module");
const categories_module_1 = require("./modules/categories/categories.module");
const withdrawals_module_1 = require("./modules/withdrawals/withdrawals.module");
const admin_module_1 = require("./modules/admin/admin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 3306),
                    username: configService.get('DB_USERNAME', 'root'),
                    password: configService.get('DB_PASSWORD', ''),
                    database: configService.get('DB_DATABASE', 'pharmakart'),
                    entities: [
                        entities_1.User,
                        entities_1.Pharmacy,
                        entities_1.Rider,
                        entities_1.Category,
                        entities_1.Medicine,
                        entities_1.PharmacyMedicine,
                        entities_1.Order,
                        entities_1.OrderItem,
                        entities_1.Delivery,
                        entities_1.Withdrawal,
                        entities_1.PlatformSettings,
                    ],
                    synchronize: true,
                    logging: configService.get('NODE_ENV') === 'development',
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            pharmacies_module_1.PharmaciesModule,
            medicines_module_1.MedicinesModule,
            orders_module_1.OrdersModule,
            deliveries_module_1.DeliveriesModule,
            categories_module_1.CategoriesModule,
            withdrawals_module_1.WithdrawalsModule,
            admin_module_1.AdminModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map